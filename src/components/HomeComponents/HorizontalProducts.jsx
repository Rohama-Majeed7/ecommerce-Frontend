import React, { useEffect, useState, useRef } from "react";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../../store/authSlice";
import AddToWishList from "../AddToWishList";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaHeart, FaStar, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const HorizontalProducts = ({ category, heading, showViewAll = true }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.authenticator?.user);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const products = await fetchCategoryWiseProducts(category, token);
        setData(products || []);
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
  }, [category, token]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  // Handle scroll buttons
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && data.length > 0) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [data]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      await addToCart(e, id, token);
      dispatch(manageState());
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };

  const placeholder = new Array(6).fill(null);

  // Calculate average rating (if available)
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

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
          
          {showViewAll && !loading && data.length > 0 && (
            <Link
              to={`/category/${encodeURIComponent(category)}`}
              className="text-primary hover:text-primary/80 font-semibold text-sm md:text-base transition-colors flex items-center gap-1 group"
            >
              <span>View All</span>
              <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Products Slider Container */}
        <div className="relative group">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm text-primary p-2 md:p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -ml-3 md:-ml-4 lg:flex hidden"
              aria-label="Previous products"
            >
              <FaChevronLeft className="text-sm md:text-lg" />
            </button>
          )}

          {/* Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#0078D7 #e5e7eb'
            }}
          >
            {(loading ? placeholder : data).map((el, index) => (
              <div
                key={loading ? index : el?._id}
                className="group/product relative flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px]"
              >
                {!loading && (
                  <Link
                    to={`single-product/${el?._id}`}
                    className="block bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    {/* Product Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-48 md:h-56">
                      {loading ? (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                      ) : (
                        <>
                          <img
                            src={el?.productImage?.[0]}
                            alt={el?.productName}
                            className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          
                          {/* Discount Badge (if available) */}
                          {el?.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{el.discount}%
                            </div>
                          )}
                          
                          {/* Quick action buttons overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button
                              onClick={(e) => handleAddToCart(e, el?._id)}
                              disabled={addingToCart[el?._id]}
                              className="bg-white text-primary p-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                              {addingToCart[el?._id] ? (
                                <FaSpinner className="animate-spin text-sm" />
                              ) : (
                                <FaShoppingCart className="text-sm" />
                              )}
                            </button>
                            <AddToWishList product={el} userId={user?._id} />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-2">
                      {loading ? (
                        <>
                          <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
                          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                        </>
                      ) : (
                        <>
                          {/* Brand/Category Tag */}
                          {el?.brand && (
                            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                              {el.brand}
                            </span>
                          )}
                          
                          {/* Product Name */}
                          <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 group-hover/product:text-primary transition-colors">
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
                                ({el.reviews.length} reviews)
                              </span>
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg md:text-xl font-bold text-primary">
                              ${el?.sellingPrice?.toFixed(2)}
                            </span>
                            {el?.originalPrice > el?.sellingPrice && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ${el?.originalPrice?.toFixed(2)}
                                </span>
                                <span className="text-xs text-green-600 font-semibold">
                                  Save ${(el.originalPrice - el.sellingPrice).toFixed(2)}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          {/* {el?.stock > 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 font-medium">
                              Out of Stock
                            </span>
                          )} */}
                        </>
                      )}
                    </div>
                  </Link>
                )}
                
                {loading && (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-48 md:h-56 bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Navigation Arrow */}
          {showRightArrow && !loading && data.length > 0 && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm text-primary p-2 md:p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -mr-3 md:-mr-4 lg:flex hidden"
              aria-label="Next products"
            >
              <FaChevronRight className="text-sm md:text-lg" />
            </button>
          )}
        </div>

        {/* Mobile Scroll Indicator */}
        {!loading && data.length > 0 && (
          <div className="flex justify-center gap-1 mt-6 lg:hidden">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-1 bg-primary/50 rounded-full"></div>
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0078D7;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #005a9e;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
        }
      `}</style>
    </section>
  );
};

export default HorizontalProducts;