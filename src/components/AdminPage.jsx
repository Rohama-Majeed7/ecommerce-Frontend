import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaUserShield, FaBell, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const AdminPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state?.authenticator?.user);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      // toast.error("Access denied. Admin only area.");
      navigate("/login");
    }else{
      navigate("/admin/users")
    }
  }, [user, navigate]);

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render anything while checking admin status
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, slide-out on mobile */}
      <Sidebar isMobile={isMobile} />

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen transition-all duration-300">
        {/* Top Header - Only visible on desktop */}
        <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FaUserShield className="text-2xl text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manage your store efficiently</p>
              </div>
            </div>
            
            {/* Desktop User Info */}
            <div className="flex items-center gap-6">
              {/* Notifications */}
             
              
              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <img
                  src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=0078D7&color=fff`}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)] overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;