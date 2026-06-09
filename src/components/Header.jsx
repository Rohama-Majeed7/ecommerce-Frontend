import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/OtherImgs/logo.png";
import { CiSearch, CiShoppingCart, CiHeart, CiLogout, CiUser } from "react-icons/ci";
import { FaUserCircle, FaChevronDown, FaTimes, FaBars } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const adminDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdmin(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || user?.role === "admin") return;
      
      try {
        const response = await axios.get(
          "https://ecommerce-backend.rohama-majeed7.deno.net/cart/cartitemcount",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
  }, [value, token, user?.role, dispatch]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend.rohama-majeed7.deno.net/user/logout",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg || "Logged out successfully!");
        dispatch(logout());
        dispatch(authUser(response.data));
        navigate("/login");
        setShowMobileMenu(false);
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    } else {
      toast.error("Please enter a search term");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Navigation items
  const navItems = user?._id && user?.role !== "admin" ? [
    { name: "Shop", path: "/shop" },
    { name: "Wishlist", path: "/wishlist", icon: <CiHeart className="text-xl" /> },
  ] : [];

  return (
    <nav className={`w-full bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transform transition-transform hover:scale-105">
            <img src={logo} alt="logo" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Desktop Search Bar */}
          {user?._id && user?.role !== "admin" && (
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
                  />
                  <button
                    type="submit"
                    className="bg-secondary px-4 py-2 hover:bg-secondary/90 transition-colors"
                  >
                    <CiSearch className="text-white text-xl" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Admin Avatar & Dropdown */}
            {user?.role === "admin" ? (
              <div className="relative" ref={adminDropdownRef}>
                <div 
                  onClick={() => setShowAdmin(!showAdmin)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <img
                    src={user?.profilePic || avatar}
                    className="w-10 h-10 rounded-full border-2 border-secondary object-cover group-hover:border-white transition-colors"
                    alt="admin avatar"
                  />
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${showAdmin ? 'rotate-180' : ''}`} />
                </div>
                
                {showAdmin && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <p className="text-sm font-semibold">{user?.username || "Admin"}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/admin/users"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowAdmin(false)}
                    >
                      <CiUser className="text-lg" />
                      <span>Admin Panel</span>
                    </Link>
                    <Link
                      to="/order"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowAdmin(false)}
                    >
                      <CiShoppingCart className="text-lg" />
                      <span>Orders</span>
                    </Link>
                    <hr />
                    <button
                      onClick={() => {
                        setShowAdmin(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                    >
                      <CiLogout className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              user?._id && (
                <Link to="/profile" className="flex-shrink-0">
                  <img
                    src={user?.profilePic || avatar}
                    className="w-10 h-10 rounded-full border-2 border-secondary object-cover hover:border-white transition-colors"
                    alt="user avatar"
                  />
                </Link>
              )
            )}

            {/* Cart Icon */}
            {user?._id && user?.role !== "admin" && (
              <Link to="/cart" className="relative hover:scale-110 transition-transform">
                <CiShoppingCart className="text-2xl lg:text-3xl" />
                {count > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1">
                    {count > 99 ? '99+' : count}
                  </div>
                )}
              </Link>
            )}

            {/* Auth Button */}
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {user?._id && user?.role !== "admin" && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CiSearch className="text-2xl" />
              </button>
            )}
            
            {user?._id && user?.role !== "admin" && (
              <Link to="/cart" className="relative">
                <CiShoppingCart className="text-2xl" />
                {count > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[18px] h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1">
                    {count > 99 ? '99+' : count}
                  </div>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {showMobileMenu ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && user?._id && user?.role !== "admin" && (
          <div className="md:hidden mt-3" style={{ animation: 'slideDown 0.3s ease-out' }}>
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-secondary px-4 py-2 hover:bg-secondary/90 transition-colors"
                >
                  <CiSearch className="text-white text-xl" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-white/20" style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="pt-4 space-y-3">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                  <img
                    src={user?.profilePic || avatar}
                    className="w-12 h-12 rounded-full border-2 border-secondary object-cover"
                    alt="user avatar"
                  />
                  <div>
                    <p className="font-semibold">{user?.username || "User"}</p>
                    <p className="text-xs text-white/80">{user?.email}</p>
                  </div>
                </div>
              )}
              
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <CiUser className="text-xl" />
                    <span>Admin Panel</span>
                  </Link>
                  <Link
                    to="/order"
                    className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <CiShoppingCart className="text-xl" />
                    <span>Orders</span>
                  </Link>
                </>
              )}
              
              {/* Wishlist for mobile */}
              {user?._id && user?.role !== "admin" && (
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CiHeart className="text-xl" />
                  <span>Wishlist</span>
                </Link>
              )}
              
              {/* Auth Button Mobile */}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all duration-300 text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add global styles for animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;