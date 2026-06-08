import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state?.authenticator?.user);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only area.");
      navigate("/");
    }
  }, [user, navigate]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('admin-sidebar');
        const menuButton = document.getElementById('menu-button');
        if (sidebar && !sidebar.contains(event.target) && !menuButton?.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              id="menu-button"
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <FaTimes className="text-2xl text-primary" />
              ) : (
                <FaBars className="text-2xl text-primary" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <FaUserShield className="text-2xl text-primary" />
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          </div>
          
          {/* Mobile User Indicator */}
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user?.profilePic || "https://via.placeholder.com/40"}
                alt={user?.username}
                className="w-8 h-8 rounded-full border-2 border-primary object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          id="admin-sidebar"
          className={`fixed lg:relative z-50 transition-all duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:flex-shrink-0`}
        >
          <div className="h-full bg-white border-r-2 border-primary shadow-xl overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen transition-all duration-300">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white shadow-md sticky top-0 z-20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <FaUserShield className="text-3xl text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your store efficiently</p>
                </div>
              </div>
              
              {/* Desktop User Info */}
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <img
                    src={user?.profilePic || "https://via.placeholder.com/40"}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;