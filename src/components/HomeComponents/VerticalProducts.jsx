import React, { useEffect, useState } from "react";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../../store/authSlice";
import AddToWishList from "../AddToWishList";
import { FaShoppingCart, FaStar, FaSpinner, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";

const VerticalProducts = ({ category, heading, limit = 8, showViewAll = true }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.authenticator?.user);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        const products = await fetchCategoryWiseProducts(category, token);
        // Limit the number of products shown
        setData(products?.slice(0, limit) || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category, token, limit]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      await addToCart(e, id, token);
      dispatch(manageState());
      // toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };

  // Calculate average rating
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const placeholder = new Array(limit).fill(null);

  if (error) {
    return (
      <section className="w-full my-8 px-4">
        <div className="container mx-auto">
          <div className="bg-red-50 rounded-xl p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <section className="w-full my-8 px-4">
        <div className="container mx-auto">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">No products found in {heading || category} category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full my-8 md:my-12 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
              {heading || category}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mt-2 rounded-full"></div>
          </div>
          
          {/* {showViewAll && !loading && data.length > 0 && (
            <Link
              to={`/category/${encodeURIComponent(category)}`}
              className="text-primary hover:text-primary/80 font-semibold text-sm md:text-base transition-colors flex items-center gap-1 group"
            >
              <span>View All</span>
              <FaEye className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          )} */}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {(loading ? placeholder : data).map((el, index) => (
            <div
              key={loading ? index : el?._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => !loading && setHoveredProduct(el?._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {!loading ? (
                <Link to={`/single-product/${el?._id}`} className="block">
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
                    <img
                      src={el?.productImage?.[0]}
                      alt={el?.productName}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Discount Badge */}
                    {el?.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        -{el.discount}%
                      </div>
                    )}
                    
                    {/* New Badge */}
                    {el?.isNew && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        New
                      </div>
                    )}
                    
                    {/* Quick Actions Overlay */}
                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                      hoveredProduct === el?._id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                      <button
                        onClick={(e) => handleAddToCart(e, el?._id)}
                        disabled={addingToCart[el?._id]}
                        className="bg-white text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        {addingToCart[el?._id] ? (
                          <FaSpinner className="animate-spin text-lg" />
                        ) : (
                          <FaShoppingCart className="text-lg" />
                        )}
                      </button>
                      <AddToWishList product={el} userId={user?._id} />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    {/* Brand/Category */}
                    {el?.brand && (
                      <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                        {el.brand}
                      </span>
                    )}
                    
                    {/* Product Name */}
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                      {el?.productName}
                    </h3>
                    
                    {/* Rating */}
                    {el?.reviews && el.reviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(getAverageRating(el.reviews))
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({el.reviews.length})
                        </span>
                      </div>
                    )}
                    
                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg md:text-xl font-bold text-primary">
                        {formatPrice(el?.sellingPrice)}
                      </span>
                      {el?.originalPrice > el?.sellingPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(el?.originalPrice)}
                          </span>
                          <span className="text-xs text-green-600 font-semibold">
                            Save {formatPrice(el.originalPrice - el.sellingPrice)}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    {/* <div className="flex items-center justify-between pt-2">
                      {el?.stock > 0 ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                          In Stock ({el.stock})
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                          Out of Stock
                        </span>
                      )}
                      
                      {/* Free Shipping Badge */}
                      {/* {el?.freeShipping && (
                        <span className="text-xs text-blue-600 font-medium">
                          Free Shipping
                        </span>
                      )} */}
                    {/* </div> */} 
                    
                    {/* Add to Cart Button (Mobile) */}
                    <button
                      onClick={(e) => handleAddToCart(e, el?._id)}
                      disabled={addingToCart[el?._id] || el?.stock === 0}
                      className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 mt-3 lg:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart[el?._id] ? (
                        <div className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin" />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FaShoppingCart />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </button>
                  </div>
                </Link>
              ) : (
                /* Skeleton Loading */
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button (Optional) */}
        {!loading && data.length >= limit && data.length < 20 && (
          <div className="text-center mt-10">
            <button
              onClick={() => {
                // Implement load more functionality if needed
                const newLimit = limit + 4;
                // Re-fetch with new limit
              }}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: block;
          overflow: hidden;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default VerticalProducts;