import React, { useEffect, useState } from "react";
import avatar from "../assets/OtherImgs/signin.gif";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle, FaGithub, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authUser, manageState, setToken } from "../store/authSlice";

const Login = () => {
  const user = useSelector((state) => state?.authenticator?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.authenticator?.token);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Load saved email if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(data).forEach(key => {
      const error = validateField(key, data[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        "https://ecommerce-backend.rohama-majeed7.deno.net/user/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      console.log("login response:", response);

      if (response.status === 200) {
        // Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        toast.success(response.data.msg || "Login successful!");
        dispatch(setToken(response.data.token));
        dispatch(authUser(response.data.user));
        dispatch(manageState());
        
        // Redirect based on role
        if (response?.data?.user?.role === "admin") {
          setTimeout(() => navigate("/admin/users"), 500);
        } else {
          setTimeout(() => navigate("/"), 500);
        }
      } else {
        toast.error(response.data.msg || "Login failed");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Login failed. Please check your credentials!";
      toast.error(errorMsg);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials for testing (remove in production)
  const fillDemoCredentials = () => {
    setData({
      email: "demo@example.com",
      password: "Demo123!",
    });
    toast.success("Demo credentials filled!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-6">
            <div className="text-center">
              <img
                src={avatar}
                alt="login"
                className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg"
              />
              <h2 className="mt-3 text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-white/80 text-sm mt-1">Sign in to continue to your account</p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleOnSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  required
                  placeholder="example@email.com"
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link 
                to="/forgot-page" 
                className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-primary transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Demo Credentials Button (Remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Fill Demo Credentials
              </button>
            )}

            {/* Social Login Section */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div> */}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm text-gray-700">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaGithub className="text-gray-800" />
                <span className="text-sm text-gray-700">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-sm text-center text-gray-600 pt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 underline transition-colors">
                Create one now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;