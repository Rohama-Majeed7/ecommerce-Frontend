import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHome, FaTimesCircle, FaArrowLeft, FaRegSadTear } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl animate-fadeInUp">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
            <div className="relative">
              {/* Animated icon */}
              <div className="inline-block p-4 bg-white/20 rounded-full mb-4 animate-pulse">
                <FaTimesCircle className="text-6xl text-white" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <MdErrorOutline className="text-yellow-300 text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-white/90 text-sm">
              Your transaction was not completed
            </p>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Main Message */}
            <div className="text-center space-y-3">
              <FaRegSadTear className="text-5xl text-gray-400 mx-auto" />
              <div className="space-y-2">
                <p className="text-gray-800 font-semibold text-lg">
                  Oops! Something went wrong
                </p>
                <p className="text-gray-500 text-sm">
                  Your payment was cancelled. Don't worry, you haven't been charged.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">What would you like to do?</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/cart"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl"
              >
                <FaShoppingCart className="text-lg" />
                Return to Cart
              </Link>

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl"
              >
                <FaHome className="text-lg" />
                Continue Shopping
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                <FaArrowLeft className="text-sm" />
                Go Back
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BiSupport className="text-blue-600 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Need help with your payment?
                  </p>
                  <p className="text-xs text-gray-600">
                    If you're experiencing technical issues, please contact our support team.
                    We're here to help 24/7.
                  </p>
                  <button
                    onClick={() => window.location.href = "mailto:support@example.com"}
                    className="mt-2 text-xs text-primary font-semibold hover:underline"
                  >
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                You can try again or use a different payment method
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Cancel;