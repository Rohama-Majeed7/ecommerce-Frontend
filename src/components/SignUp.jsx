import React, { useState } from "react";
import avatar from "../assets/OtherImgs/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import uploadProfilePic from "../helpers/uploadProfilePic";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    role: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!data.role) return toast.error("Please select a role.");
    if (data.password !== data.confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      const response = await axios.post(
        "http://localhost:8080/user/signup",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg);
        navigate("/login");
      }
    } catch {
      toast.error("Sign-up failed. Please try again.");
    }

    setData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: "",
      role: "",
    });
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const profileImg = await uploadProfilePic(file);
    setData((prev) => ({ ...prev, profilePic: profileImg.url }));
  };

  return (
    <div className=" bg-[#F1F5F9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px] bg-white border-4 border-primary rounded-xl shadow-md p-2">
        {/* Avatar Upload */}
        <div className="text-center">
          <img
            src={data?.profilePic || avatar}
            alt="profile"
            className="w-20 h-20 mx-auto rounded-full border-4 border-primary"
          />
          <label htmlFor="file-input">
            <span className="mt-2 inline-block bg-primary text-white px-4 py-1 rounded cursor-pointer hover:bg-secondary transition">
              Upload Photo
            </span>
          </label>
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleUploadPic}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleOnSubmit} className="space-y-2 ">
          <h2 className="text-xl font-bold text-center text-text">
            Create Account
          </h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Name
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleOnChange}
              required
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer px-3 text-gray-600 hover:text-primary"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 outline-none"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer px-3 text-gray-600 hover:text-primary"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={data.role}
              onChange={handleOnChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Choose Role --</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-secondary transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
