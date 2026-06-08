import React, { useEffect, useState } from "react";
import SUCCESSIMAGE from "../assets/OtherImgs/success.gif";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaReceipt, FaHome, FaShare, FaCheckCircle, FaTruck, FaEnvelope } from "react-icons/fa";
import { MdConfirmationNumber } from "react-icons/md";
import { useSelector } from "react-redux";
import confetti from 'canvas-confetti';

const Success = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.authenticator?.user);
  const [orderNumber, setOrderNumber] = useState(null);
  const [countdown, setCountdown] = useState(5);

  // Generate random order number on component mount
  useEffect(() => {
    const randomOrder = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(randomOrder);
    
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#059669', '#047857']
    });
    
    // Countdown to redirect to orders page
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/order');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Order confirmation link copied!");
  };

  const formatTime = (seconds) => {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl animate-slideUp">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="inline-block p-3 bg-white/20 rounded-full mb-4 animate-bounce">
                <FaCheckCircle className="text-5xl text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-white/90 text-sm">
                Thank you for your purchase
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Animated Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={SUCCESSIMAGE}
                  width={120}
                  height={120}
                  alt="Success"
                  className="animate-scaleIn"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
              </div>
            </div>

            {/* Order Confirmation Message */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-gray-800">
                Order Confirmed!
              </h2>
              <p className="text-gray-600 text-sm">
                Your order has been successfully placed and will be processed shortly.
              </p>
              {orderNumber && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-mono font-bold text-primary">
                    {orderNumber}
                  </p>
                  <button
                    onClick={handleShare}
                    className="mt-2 text-xs text-primary hover:text-primary/80 flex items-center justify-center gap-1"
                  >
                    <FaShare size={10} />
                    <span>Copy Order ID</span>
                  </button>
                </div>
              )}
            </div>

            {/* Order Details Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold text-gray-800">{user?.username || 'Guest User'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-800">{user?.email || 'guest@example.com'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <FaCheckCircle size={12} />
                  Paid
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery:</span>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  <FaTruck size={12} />
                  Estimated 3-5 days
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/order"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <FaReceipt className="text-lg group-hover:rotate-12 transition-transform" />
                <span>View My Orders</span>
              </Link>

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FaShoppingBag className="text-lg" />
                <span>Continue Shopping</span>
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                <FaHome className="text-lg" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Auto-redirect Notice */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Redirecting to orders page in {formatTime(countdown)}...
              </p>
              <button
                onClick={() => navigate('/order')}
                className="text-xs text-primary hover:underline mt-1"
              >
                Click here if not redirected
              </button>
            </div>

            {/* Email Notice */}
            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <FaEnvelope className="text-blue-500 text-sm mt-0.5" />
              <p className="text-xs text-blue-800">
                A confirmation email has been sent to your registered email address with order details.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Success;