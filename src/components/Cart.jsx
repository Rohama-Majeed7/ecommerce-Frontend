import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import { MdOutlineDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const value = useSelector((state) => state?.authenticator?.value);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://ecommerce-backend-theta-dun.vercel.app/cart/cartproducts",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setData(response.data.cartProducts);
        setLoading(false);
      }
    };
    fetchData();
  }, [value]);

  const increaseQty = async (id, qty) => {
    const response = await axios.post(
      "https://ecommerce-backend-theta-dun.vercel.app/cart/update-cartproduct",
      { _id: id, quantity: qty + 1 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) dispatch(manageState());
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await axios.post(
        "https://ecommerce-backend-theta-dun.vercel.app/cart/update-cartproduct",
        { _id: id, quantity: qty - 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) dispatch(manageState());
    }
  };

  const deleteProduct = async (id) => {
    const response = await axios.delete(
      `https://ecommerce-backend-theta-dun.vercel.app/cart/delete-cartproduct/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success(response.data.msg);
    }
  };
  const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + item.productId?.sellingPrice * item.quantity,
    0
  );

  const handlePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51Q3uuPA1xDrAsNkikvbukeQKU6O6bKXcYg9vSSXWKcflAVKuNVpyMi8Y9Y69P0Z8EUKEEHnO832AM3d1fPdC47Gy00KitOyH0R"
    );
    const response = await axios.post(
      "https://ecommerce-backend-theta-dun.vercel.app/user/checkout",
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
      stripe.redirectToCheckout({ sessionId: response.data.id });
    }
  };

  return (
    <section className="w-11/12 mx-auto my-4">
      {loading ? (
        <p className="text-center py-10 text-lg text-[#0A1F44]">Loading...</p>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-2xl text-[#0A1F44] font-bold">
          Your cart is empty.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Products */}
          <div className="w-full lg:w-2/3 max-h-[75vh] overflow-y-auto custom-scrollbar p-4 shadow-md border-2 border-[#0078D7] rounded-md">
            {data.map((product) => (
              <div
                key={product._id}
                className="flex gap-4 items-center border-b py-3 relative"
              >
                <img
                  src={product?.productId?.productImage[0]}
                  className="w-24 h-24 object-contain border rounded-md bg-white"
                  alt="product"
                />
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="text-lg font-bold capitalize text-[#0A1F44]">
                    {product?.productId?.productName}
                  </h2>
                  <p className="text-sm text-[#0078D7] capitalize">
                    {product?.productId?.category}
                  </p>
                  <span className="font-bold text-[#0078D7] text-xl">
                    ${product?.productId?.sellingPrice}
                  </span>
                  <div className="flex gap-2 mt-2 items-center">
                    <button
                      onClick={() => increaseQty(product._id, product.quantity)}
                      className="w-8 h-8 bg-[#0078D7] text-white rounded-md"
                    >
                      +
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => decreaseQty(product._id, product.quantity)}
                      className="w-8 h-8 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-white bg-red-600 p-2 rounded-full absolute top-0 right-0 hover:bg-red-700"
                >
                  <MdOutlineDeleteOutline size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-1/3 p-4 border-2 border-[#0078D7] rounded-md shadow-md bg-white h-fit">
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-[#0A1F44]">Total Quantity:</span>
              <span>{totalQty}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-[#0A1F44]">Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-[#0078D7] hover:bg-[#005BB5] text-white py-2 rounded-md font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
