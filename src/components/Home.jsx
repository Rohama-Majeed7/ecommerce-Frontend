import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryList from "./HomeComponents/CategoryList";
import Slider from "./Slider";
import HorizontalProducts from "./HomeComponents/HorizontalProducts";
import VerticalProducts from "./HomeComponents/VerticalProducts";
import { FaArrowRight, FaShoppingBag, FaTruck, FaShieldAlt, FaHeadset, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const user = useSelector((state) => state?.authenticator?.user);

  useEffect(() => {
      if (user && user.role === "admin") {
        // toast.error("Access denied. Admin only area.");
        navigate("/admin/products");
      }
    }, [user, navigate]);
  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="w-full">
        {/* Hero Banner Section */}
        <section className="mb-8 md:mb-12">
          <Slider />
        </section>

        {/* Category Navigation */}
        <section className="mb-8 md:mb-12">
          <div className="container mx-auto px-4">
            <CategoryList />
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-12 md:mb-16">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                Featured Products
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Discover our handpicked selection of top-rated products
              </p>
            </div>

            {/* Horizontal Products */}
            <div className="space-y-12 md:space-y-16">
              <HorizontalProducts category="airpodes" heading="Premium Audio" />
              <HorizontalProducts category="Mouse" heading="Gaming & Office Mice" />
              <HorizontalProducts category="camera" heading="Professional Cameras" />
            </div>
          </div>
        </section>


        {/* Vertical Products Section */}
        <section className="mb-12 md:mb-16">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                Popular Categories
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Explore our most popular product categories
              </p>
            </div>

            {/* Vertical Products */}
            <div className="space-y-12 md:space-y-16">
              <VerticalProducts category="mobiles" heading="Latest Smartphones" />
              <VerticalProducts category="televisions" heading="Smart Televisions" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="my-12 md:my-16 bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <FaTruck className="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over $100</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <FaShieldAlt className="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure transactions</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <FaHeadset className="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-500">Dedicated customer service</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <FaStar className="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
                <p className="text-sm text-gray-500">Best products guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110 z-50 animate-bounce"
            aria-label="Scroll to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;