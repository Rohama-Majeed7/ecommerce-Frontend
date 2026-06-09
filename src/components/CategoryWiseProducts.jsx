import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import addToCart from "../helpers/addToCart";
import { manageState } from "../store/authSlice";
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaStar, 
  FaStarHalf, 
  FaRegStar,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSpinner
} from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { toast } from "react-hot-toast";

const CategoryWiseProducts = ({ data, heading }) => {
  const token = useSelector((state) => state?.authenticator?.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      await addToCart(e, id, token);
      dispatch(manageState());
      // toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Sort and filter products
  const filteredProducts = data
    .filter(product => {
      const price = product?.sellingPrice || 0;
      return price >= priceRange.min && price <= priceRange.max;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.productName?.localeCompare(b.productName);
          break;
        case "price":
          comparison = (a.sellingPrice || 0) - (b.sellingPrice || 0);
          break;
        case "rating":
          comparison = (getAverageRating(a.reviews) || 0) - (getAverageRating(b.reviews) || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const getRatingStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                {heading || "Products"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter />
                <span className="text-sm">Filter</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="default">Sort by: Default</option>
                <option value="name">Sort by: Name</option>
                <option value="price">Sort by: Price</option>
                <option value="rating">Sort by: Rating</option>
              </select>
              
              {sortBy !== "default" && (
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 animate-slideDown">
            <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => setPriceRange({ min: 0, max: 1000 })}
                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MdOutlineProductionQuantityLimits className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No Products Found</p>
            <p className="text-gray-400 mt-2">
              Try adjusting your filters or browse other categories
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const rating = getAverageRating(product?.reviews);
              const discount = product?.originalPrice > product?.sellingPrice;
              const discountPercent = discount 
                ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
                : 0;
              
              return (
                <div
                  key={product?._id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/single-product/${product?._id}`)}
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
                    
                    {/* Quick Add to Cart Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => handleAddToCart(e, product?._id)}
                        disabled={addingToCart[product?._id]}
                        className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      >
                        {addingToCart[product?._id] ? (
                          <FaSpinner className="animate-spin mx-auto" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaShoppingCart />
                            <span>Add to Cart</span>
                          </div>
                        )}
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
                    {rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {getRatingStars(rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product?.reviews?.length || 0})
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
                    
                    {/* Stock Status */}
                    {product?.stock > 0 ? (
                      product?.stock < 10 ? (
                        <p className="text-xs text-orange-600 font-medium">
                          Only {product.stock} left in stock!
                        </p>
                      ) : (
                        <p className="text-xs text-green-600 font-medium">
                          In Stock
                        </p>
                      )
                    ) : (
                      <p className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More (Optional - can be implemented with pagination) */}
        {filteredProducts.length > 0 && filteredProducts.length < data.length && (
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

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
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

export default CategoryWiseProducts;