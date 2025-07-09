import React, { useEffect, useState } from "react";
import logo from "../assets/OtherImgs/logo.png";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authUser,
  logout,
  manageState,
  setCartCount,
} from "../store/authSlice.js";
import avatar from "../assets/OtherImgs/signin.gif";
import axios from "axios";
import { toast } from "react-hot-toast";

const Header = () => {
  const token = useSelector((state) => state?.authenticator?.token);
  const count = useSelector((state) => state?.authenticator?.cartCount);
  const value = useSelector((state) => state?.authenticator?.value);
  const user = useSelector((state) => state?.authenticator?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);
  console.log("user token:", token);
  console.log("login user:", user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-backend-theta-dun.vercel.app/cart/cartitemcount",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          dispatch(setCartCount(response.data.count));
        }
      } catch (err) {
        console.error("Error fetching cart count", err);
      }
    };
    fetchData();
  }, [value]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend-theta-dun.vercel.app/user/logout",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg);
        dispatch(logout());
        dispatch(authUser(response.data));
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
    dispatch(manageState());
  };

  return (
    <nav className="w-full bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="w-20" />
        </Link>

        {/* Search Bar */}
        {user?._id && user?.role !== "admin" && (
          <div className="hidden md:flex items-center border border-white rounded-full overflow-hidden">
            <input
              type="search"
              placeholder="Search products..."
              className="px-4 py-2  text-sm w-64 outline-none text-black"
              onChange={(e) => handleSearch(e)}
            />
            <div className="bg-secondary px-3 py-2">
              <CiSearch className="text-white text-xl" />
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Admin Avatar & Dropdown */}
          {user?.role === "admin" ? (
            <div className="relative">
              <img
                src={user?.profilePic || avatar}
                onClick={() => setShowAdmin(!showAdmin)}
                className="w-12 h-12 rounded-full border-2 border-secondary cursor-pointer"
              />
              {showAdmin && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-text rounded-md shadow-md z-50 overflow-hidden">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                  <hr />
                  <Link
                    to="/order"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <img
              src={user?.profilePic || avatar}
              className="w-12 h-12 rounded-full border-2 border-secondary"
            />
          )}

          {/* Cart Icon */}
          {user?._id && user?.role !== "admin" && (
            <Link to="/cart" className="relative">
              <CiShoppingCart className="text-3xl" />
              <div className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">
                {count}
              </div>
            </Link>
          )}

          {/* Wishlist Link */}
          {user?._id && user?.role !== "admin" && (
            <Link
              to="/wishlist"
              className="text-white font-medium hover:underline text-sm"
            >
              Wishlist
            </Link>
          )}

          {/* Auth Button */}
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-3 py-1 rounded-md font-semibold hover:bg-secondary hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-primary px-3 py-1 rounded-md font-semibold hover:bg-secondary hover:text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
