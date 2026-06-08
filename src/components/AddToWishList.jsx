import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const AddToWishList = ({ product, userId, onWishlistUpdate, className = "" }) => {
  const token = useSelector((state) => state?.authenticator?.token);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Check if product is already in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !product?._id) return;

      try {
        const response = await axios.get(
          `https://ecommerce-backend.rohama-majeed7.deno.net/wishlistApi/wishlist/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        
        if (response.status === 200 && response.data.wishlist) {
          const exists = response.data.wishlist.some(
            (item) => item.productId === product._id
          );
          setIsInWishlist(exists);
        }
      } catch (err) {
        console.error("Error checking wishlist status:", err);
      }
    };

    checkWishlistStatus();
  }, [userId, product?._id, token]);

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("Please login to add to wishlist", {
        icon: '🔒',
        duration: 3000,
      });
      return;
    }

    if (loading) return;

    setLoading(true);
    
    try {
      const response = await axios.post(
        "https://ecommerce-backend.rohama-majeed7.deno.net/wishlistApi/wishlist",
        {
          userId,
          productId: product._id,
          name: product.productName,
          image: product.productImage?.[0] || product.productImage,
          price: product.sellingPrice || product.price,
          originalPrice: product.originalPrice,
          category: product.category,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        setIsInWishlist(true);
        toast.success("Added to wishlist! ❤️", {
          duration: 2000,
        });
        
        // Callback to parent component if provided
        if (onWishlistUpdate) {
          onWishlistUpdate(true, product._id);
        }
      } else {
        toast.error(response.data.message || "Failed to add to wishlist");
      }
    } catch (err) {
      console.error("Wishlist Error:", err);
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        toast.error("Product already in wishlist");
        setIsInWishlist(true);
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error adding to wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      const response = await axios.delete(
        `https://ecommerce-backend.rohama-majeed7.deno.net/wishlistApi/wishlist/${userId}/${product._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsInWishlist(false);
        toast.success("Removed from wishlist", {
          icon: '💔',
          duration: 2000,
        });
        
        if (onWishlistUpdate) {
          onWishlistUpdate(false, product._id);
        }
      } else {
        toast.error("Failed to remove from wishlist");
      }
    } catch (err) {
      console.error("Remove from wishlist Error:", err);
      toast.error("Error removing from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isInWishlist) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`relative group ${className}`}
      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        {/* Heart Icon */}
        <FaHeart
          className={`transition-all duration-300 ${
            loading ? 'animate-pulse' : ''
          } ${
            isInWishlist
              ? 'text-red-500 fill-current'
              : hovered
              ? 'text-red-400 scale-110'
              : 'text-gray-400 hover:text-red-400'
          } ${className.includes('text-') ? '' : 'text-xl md:text-2xl'}`}
          style={{
            filter: isInWishlist ? 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.5))' : 'none',
          }}
        />
        
        {/* Ripple Effect */}
        {!isInWishlist && hovered && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
          </span>
        )}
        
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </span>
      
      {/* Heartbeat Animation for newly added */}
      {isInWishlist && !loading && (
        <style jsx>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          button:active svg {
            animation: heartbeat 0.3s ease-in-out;
          }
        `}</style>
      )}
    </button>
  );
};

export default AddToWishList;