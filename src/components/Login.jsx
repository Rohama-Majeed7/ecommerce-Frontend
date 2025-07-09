import React, { useEffect, useState } from "react";
import avatar from "../assets/OtherImgs/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authUser, manageState, setToken } from "../store/authSlice";

const Login = () => {
  const user = useSelector((state) => state?.authenticator?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecommerce-backend-theta-dun.vercel.app/user/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("login response:", response);

      if (response.statusText === 200) {
        toast.success(response.data.msg);
        dispatch(setToken(response.data.token));
        dispatch(manageState());
        navigate("/");
      } else {
        toast.error(response.data.msg);
      }
      if (response?.data?.user?.role === "admin") {
        navigate("/admin");
      }
      // } else {
      //   navigate("/");
      // }
    } catch (error) {
      toast.error("Login failed. Please check your credentials!");
      console.error("Login Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md border-4 border-primary bg-white rounded-xl shadow-md p-3">
        {/* Avatar */}
        <div className="text-center">
          <img
            src={avatar}
            alt="login"
            className="w-20 h-20 mx-auto rounded-full border-4 border-primary"
          />
          <h2 className="mt-2 text-xl font-bold text-text">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleOnSubmit} className="space-y-4">
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

          <div className="text-right">
            <Link to="/forgot-page" className="text-sm text-primary underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-secondary transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
