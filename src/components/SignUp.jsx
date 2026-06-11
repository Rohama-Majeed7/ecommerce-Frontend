import React, { useState } from "react";
import avatar from "../assets/OtherImgs/signin.gif";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserTag, FaUpload, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import uploadProfilePic from "../helpers/uploadProfilePic";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = useSelector((state) => state?.authenticator?.token);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    role: "",
  });

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 50) return "Username must be less than 50 characters";
        return "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        return "";
      case "confirmPassword":
        if (value !== data.password) return "Passwords do not match";
        return "";
      case "role":
        if (!value) return "Please select a role";
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

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
          profilePic: data.profilePic,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      if (response.status === 200) {
        toast.success(response.data.msg || "Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Sign-up failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF)");
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    setUploadingPic(true);
    try {
      const profileImg = await uploadProfilePic(file);
      if (profileImg?.url) {
        setData((prev) => ({ ...prev, profilePic: profileImg.url }));
        toast.success("Profile picture uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingPic(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Create Account
            </h2>
            <p className="text-white/80 text-center text-sm mt-1">
              Join us today and start your journey
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleOnSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <img
                  src={data?.profilePic || avatar}
                  alt="profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-primary shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {uploadingPic && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <FaSpinner className="animate-spin text-white text-2xl" />
                  </div>
                )}
              </div>
              
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg">
                  <FaUpload className="text-sm" />
                  <span className="text-sm font-medium">
                    {uploadingPic ? "Uploading..." : "Upload Photo"}
                  </span>
                </div>
              </label>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleUploadPic}
                accept="image/*"
                disabled={uploadingPic}
              />
              <p className="text-xs text-gray-500">Max size: 2MB (JPG, PNG, GIF)</p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  required
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTag className="text-gray-400 text-sm" />
                </div>
                <select
                  name="role"
                  value={data.role}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  required
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white`}
                >
                  <option value="">-- Choose Role --</option>
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || uploadingPic}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-primary transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600 pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:text-primary/80 underline transition-colors">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;