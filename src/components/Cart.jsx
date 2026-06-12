import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import { MdOutlineDeleteOutline, MdShoppingCart, MdPayment } from "react-icons/md";
import { FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaTrashAlt, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [updatingQty, setUpdatingQty] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const value = useSelector((state) => state?.authenticator?.value);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authenticator?.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, [value]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart/cartproducts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setData(response.data.cartProducts || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (id, qty) => {
    setUpdatingQty(`${id}-plus`);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/update-cartproduct`,
        { _id: id, quantity: qty + 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(manageState());
        await fetchCartData();
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingQty(null);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty <= 1) return;

    setUpdatingQty(`${id}-minus`);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/update-cartproduct`,
        { _id: id, quantity: qty - 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(manageState());
        await fetchCartData();
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingQty(null);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

    setDeletingItem(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/delete-cartproduct/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg || "Item removed from cart");
        dispatch(manageState());
        await fetchCartData();
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setDeletingItem(null);
    }
  };

  const handlePayment = async () => {
    if (data.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessingPayment(true);
    try {
      const stripe = await loadStripe(
        "pk_test_51Q3uuPA1xDrAsNkikvbukeQKU6O6bKXcYg9vSSXWKcflAVKuNVpyMi8Y9Y69P0Z8EUKEEHnO832AM3d1fPdC47Gy00KitOyH0R"
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/checkout`,
        { cartItems: data },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data?.id) {
        await stripe.redirectToCheckout({ sessionId: response.data.id });
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.msg || "Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const totalQty = data.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + (item?.productId?.sellingPrice || 0) * (item?.quantity || 0),
    0
  );
  const shippingCost = totalPrice > 0 ? (totalPrice > 100 ? 0 : 10) : 0;
  const tax = totalPrice * 0.1; // 10% tax
  const grandTotal = totalPrice + shippingCost + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdShoppingCart className="text-5xl text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <FaShoppingBag />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MdShoppingCart className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {totalQty} {totalQty === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Products */}
          <div className="flex-1 space-y-4">
            {data.map((product) => {
              const itemPrice = (product?.productId?.sellingPrice || 0) * (product?.quantity || 0);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="sm:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product?.productId?.productImage?.[0]}
                        className="w-full h-full object-contain p-2"
                        alt={product?.productId?.productName}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 capitalize mb-1">
                            {product?.productId?.productName}
                          </h3>
                          <p className="text-sm text-primary capitalize mb-2">
                            {product?.productId?.category}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl font-bold text-primary">
                              ${product?.productId?.sellingPrice?.toFixed(2)}
                            </span>
                            {product?.productId?.originalPrice > product?.productId?.sellingPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${product?.productId?.originalPrice?.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decreaseQty(product._id, product.quantity)}
                              disabled={
                                updatingQty === `${product._id}-minus` ||
                                product.quantity <= 1
                              }
                            >
                              {updatingQty === `${product._id}-minus` ? (
                                <FaSpinner className="animate-spin mx-auto" />
                              ) : (
                                <FaMinus size={12} />
                              )}
                            </button>
                            <span className="font-semibold text-gray-700 min-w-[30px] text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(product._id, product.quantity)}
                              disabled={updatingQty === `${product._id}-plus`}
                            >
                              {updatingQty === `${product._id}-plus` ? (
                                <FaSpinner className="animate-spin mx-auto" />
                              ) : (
                                <FaPlus size={12} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Item Total & Delete */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Item Total</p>
                          <p className="text-xl font-bold text-primary mb-2">
                            ${itemPrice.toFixed(2)}
                          </p>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            disabled={deletingItem === product._id}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingItem === product._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <>
                                <FaTrashAlt size={14} />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQty} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {shippingCost > 0 && totalPrice < 100 && (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm">
                    <p className="text-blue-800">
                      🎉 Add ${(100 - totalPrice).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-2xl text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <MdPayment />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center mb-3">
                  We accept
                </p>
                <div className="flex justify-center gap-2">
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">Visa</div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">Mastercard</div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">PayPal</div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">Stripe</div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;