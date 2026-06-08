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

        {/* Promotional Banner */}
        <section className="my-12 md:my-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">
                    Limited Time Offer
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">
                    Summer Sale Extravaganza!
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-4">
                    Get up to 50% off on selected items. Hurry up!
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
                  >
                    <span>Shop Now</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4">
                    <FaShoppingBag className="text-5xl text-white" />
                  </div>
                </div>
              </div>
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

        {/* Newsletter Section */}
        <section className="my-12 md:my-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-300 text-sm md:text-base mb-6">
                Get the latest updates on new products and upcoming sales
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-gray-400 text-xs mt-4">
                No spam, unsubscribe at any time
              </p>
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