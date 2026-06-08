import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import addToCart from "../helpers/addToCart";
import { FaShoppingCart, FaStar, FaStarHalf, FaRegStar, FaSpinner, FaArrowLeft, FaHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";

const VerticalSearchCard = ({ data }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authenticator?.token);
  const [addingToCart, setAddingToCart] = useState({});

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      await addToCart(e, id, token);
      dispatch(manageState());
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-400 text-sm" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }
    return stars;
  };

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-4xl text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg font-semibold">No products found</p>
          <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Results Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Search Results
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Found <span className="font-semibold text-primary">{data.length}</span> products
              </p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((product) => {
            const discount = product?.originalPrice > product?.sellingPrice;
            const discountPercent = discount 
              ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
              : 0;
            
            return (
              <Link
                to={`/single-product/${product?._id}`}
                key={product?._id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-64">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Discount Badge */}
                  {discount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product?.stock > 0 ? (
                    product?.stock < 10 ? (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        In Stock
                      </div>
                    )
                  ) : (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Quick Add to Cart Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      disabled={addingToCart[product?._id] || product?.stock === 0}
                      className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {addingToCart[product?._id] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaShoppingCart />
                      )}
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 space-y-2">
                  {/* Category */}
                  {product?.category && (
                    <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                      {product.category}
                    </span>
                  )}
                  
                  {/* Product Name */}
                  <h3 className="text-base font-bold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                    {product?.productName}
                  </h3>
                  
                  {/* Rating */}
                  {product?.averageRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(product.averageRating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product?.sellingPrice)}
                    </span>
                    {discount && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product?.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Add to Cart Button (Mobile) */}
                  <button
                    onClick={(e) => handleAddToCart(e, product?._id)}
                    disabled={addingToCart[product?._id] || product?.stock === 0}
                    className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 mt-3 lg:hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingToCart[product?._id] ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More (Optional) */}
        {data.length >= 12 && (
          <div className="text-center mt-10">
            <button
              onClick={() => {
                // Implement load more logic here
                toast.success("Load more functionality can be added");
              }}
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              Load More Products
            </button>
          </div>
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

export default VerticalSearchCard;