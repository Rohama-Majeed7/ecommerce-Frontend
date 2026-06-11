import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUsers,
  FaBoxes,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logout, authUser } from "../store/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = ({ isMobile = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profilePic = useSelector((state) => state.authenticator?.profilePic);
  const user = useSelector((state) => state.authenticator?.user);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMobileOpen]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Logged out successfully");
        dispatch(logout());
        dispatch(authUser(null));
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Menu items - Only Products, Users, Orders
  const menuItems = [
    { 
      name: "Products", 
      path: "/admin/products", 
      icon: <FaBoxes className="text-lg" />
    },
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: <FaUsers className="text-lg" />
    },
    { 
      name: "Orders", 
      path: "/admin/orders", 
      icon: <FaShoppingCart className="text-lg" />
    },
  ];

  const isVisible = isMobile ? isMobileOpen : true;

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open menu"
        >
          <FaBars className="text-lg" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar - Always visible on desktop, slides on mobile */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 transition-all duration-300 flex flex-col ${
          isMobile ? 'w-64' : 'w-64'
        } ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header - No toggle button on desktop */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="font-bold text-white text-lg">Admin Panel</span>
          </div>
          
          {/* Mobile close button - Only on mobile */}
          {isMobile && isMobileOpen && (
            <button
              onClick={toggleMobileSidebar}
              className="absolute right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <FaTimes className="text-lg" />
            </button>
          )}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profilePic || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=0078D7&color=fff`}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-sm">
                {user?.username || "Admin User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary/20 text-primary"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium text-sm">Logout</span>
          </button>
          
          <div className="pt-3 text-center">
            <p className="text-xs text-gray-500">© 2024 Admin Panel</p>
            <p className="text-xs text-gray-600 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0078D7;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #005a9e;
        }
      `}</style>
    </>
  );
};

export default Sidebar;