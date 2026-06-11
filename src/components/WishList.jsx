import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft, FaRegHeart, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const user = useSelector((state) => state?.authenticator?.user);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    fetchWishlist();
  }, [user?._id]);

  const fetchWishlist = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlistApi/wishlist/${user?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setWishlist(response.data.items || response.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingId(productId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/wishlistApi/wishlist/${user?._id}/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FaHeart className="text-2xl text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  My Wishlist
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            
            <Link
              to="/"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRegHeart className="text-5xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-semibold mb-2">
              Your wishlist is empty
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Save your favorite items here to shop them later
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <FaShoppingCart />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-64">
                    <Link to={`/single-product/${item.productId}`}>
                      <img
                        src={item.image?.[0] || item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                    
                    {/* Heart Badge */}
                    <div className="absolute top-3 left-3 bg-primary/90 text-white rounded-full p-2">
                      <FaHeart className="text-sm" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <Link to={`/single-product/${item.productId}`}>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        to={`/single-product/${item.productId}`}
                        className="flex-1 bg-primary text-white px-3 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart className="text-sm" />
                        <span>Buy Now</span>
                      </Link>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                        disabled={removingId === item.productId}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {removingId === item.productId ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear All Button */}
            {wishlist.length > 1 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                      wishlist.forEach(item => {
                        handleRemoveFromWishlist(item.productId);
                      });
                    }
                  }}
                  className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Clear All Items
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;