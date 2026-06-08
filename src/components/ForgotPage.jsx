import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaCheckCircle, FaSpinner, FaLock } from 'react-icons/fa';
import { MdEmail, MdSecurity } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address', {
        icon: '⚠️',
        duration: 3000,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
        icon: '📧',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        'https://ecommerce-backend.rohama-majeed7.deno.net/user/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setEmailSent(true);
        toast.success(response.data.msg || 'Reset link sent to your email!', {
          icon: '📨',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMsg = error.response?.data?.msg || 'Failed to send reset link. Please try again.';
      toast.error(errorMsg, {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      toast.error('Too many attempts. Please try again later.', {
        icon: '⏰',
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://ecommerce-backend.rohama-majeed7.deno.net/user/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setResendCount(prev => prev + 1);
        toast.success('Reset link resent successfully!', {
          icon: '📨',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to resend link. Please try again.', {
        icon: '❌',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl animate-fadeInUp">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
            <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
              <FaLock className="text-4xl text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-white/90 text-sm">
              Don't worry, we'll help you reset it
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {!emailSent ? (
              <>
                {/* Instruction Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm">
                    Enter your registered email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send a password reset link to this email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-semibold text-primary mb-4">
                      {email}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Please check your inbox and spam folder. The link will expire in 1 hour.
                    </p>
                  </div>

                  {/* Resend Options */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleResend}
                      disabled={loading || resendCount >= 3}
                      className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Didn\'t receive the email? Click to resend'}
                    </button>
                    
                    {resendCount > 0 && (
                      <p className="text-xs text-gray-400">
                        Resend attempts: {resendCount}/3
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
              >
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Login</span>
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MdSecurity className="text-primary" />
                  <span>Secure Reset</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <MdEmail className="text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-gray-600">
            Having trouble? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-primary font-semibold hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>

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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPage;