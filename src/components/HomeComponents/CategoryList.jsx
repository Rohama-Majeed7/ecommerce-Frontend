import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTag, FaSpinner } from "react-icons/fa";

const CategoryList = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scrollContainerRef = useRef(null);
  const categoryLoading = new Array(12).fill(null);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/get-category`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.data) {
          setCategory(response.data.data);
        } else {
          setCategory([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [token]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Handle scroll buttons
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [category]);

  // Retry fetching categories
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/get-category`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setCategory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  };

  if (error) {
    return (
      <div className="w-11/12 mx-auto my-8 p-8 bg-red-50 rounded-xl text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && category.length === 0) {
    return (
      <div className="w-11/12 mx-auto my-8 p-8 bg-gray-50 rounded-xl text-center">
        <FaTag className="text-4xl text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our wide range of products
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Category Slider Container */}
        <div className="relative group">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -ml-2 md:-ml-4 lg:hidden xl:flex"
              aria-label="Previous categories"
            >
              <FaChevronLeft className="text-lg" />
            </button>
          )}

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth custom-scrollbar py-4 px-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#0078D7 #e5e7eb'
            }}
          >
            {loading
              ? categoryLoading.map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-shrink-0 w-20 md:w-24"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                    <div className="w-14 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                ))
              : category.map((el, index) => (
                  <Link
                    to={`/get-products/${encodeURIComponent(el?.category)}`}
                    key={el?._id || index}
                    className="flex flex-col items-center group cursor-pointer flex-shrink-0 w-20 md:w-24 transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    {/* Category Image Container */}
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-primary/20 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 overflow-hidden">
                        {el?.productImage?.[0] ? (
                          <img
                            src={el.productImage[0]}
                            alt={el.category}
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaTag className="text-2xl md:text-3xl text-primary/40" />
                          </div>
                        )}
                      </div>
                      
                      {/* Decorative ring on hover */}
                      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/30 transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100"></div>
                    </div>
                    
                    {/* Category Name */}
                    <p className="text-xs md:text-sm mt-2 text-gray-700 font-semibold capitalize text-center group-hover:text-primary transition-colors">
                      {el.category}
                    </p>
                    
                    {/* Product count indicator (optional - if you have product count) */}
                    {el.productCount > 0 && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {el.productCount} items
                      </span>
                    )}
                  </Link>
                ))}
          </div>

          {/* Right Navigation Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -mr-2 md:-mr-4 lg:hidden xl:flex"
              aria-label="Next categories"
            >
              <FaChevronRight className="text-lg" />
            </button>
          )}
        </div>

        {/* View All Categories Link */}
        {/* {!loading && category.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
            >
              <span>View All Categories</span>
              <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )} */}
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
        
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
        }
      `}</style>
    </section>
  );
};

export default CategoryList;