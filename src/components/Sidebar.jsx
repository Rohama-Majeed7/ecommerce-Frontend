import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaUsers, 
  FaBoxes, 
  FaShoppingCart, 
  FaTachometerAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaStore,
  FaTag,
  FaChartLine,
  FaCog
} from "react-icons/fa";
import { logout, authUser } from "../../store/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profilePic = useSelector((state) => state.authenticator?.profilePic);
  const user = useSelector((state) => state.authenticator?.user);
  const token = useSelector((state) => state?.authenticator?.token);
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const sidebarRef = useRef(null);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, showSidebar]);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

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
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const linkClasses = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
        : "text-gray-700 hover:bg-primary/10 hover:text-primary"
    }`;
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Products",
      icon: <FaBoxes />,
      submenu: [
        { name: "All Products", path: "/admin/products" },
        { name: "Add Product", path: "/admin/add-product" },
        { name: "Categories", path: "/admin/categories" },
      ],
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingCart />,
    },
    {
      name: "Inventory",
      icon: <FaStore />,
      submenu: [
        { name: "Stock Management", path: "/admin/inventory" },
        { name: "Low Stock Alert", path: "/admin/low-stock" },
      ],
    },
    {
      name: "Discounts",
      path: "/admin/discounts",
      icon: <FaTag />,
    },
    {
      name: "Analytics",
      icon: <FaChartLine />,
      submenu: [
        { name: "Sales Report", path: "/admin/sales-report" },
        { name: "User Analytics", path: "/admin/user-analytics" },
      ],
    },
    {
      name: "Settings",
      icon: <FaCog />,
      submenu: [
        { name: "General", path: "/admin/settings" },
        { name: "Payment", path: "/admin/payment-settings" },
        { name: "Shipping", path: "/admin/shipping-settings" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative z-50 transition-all duration-300 transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-gradient-to-b from-white to-gray-50 shadow-2xl lg:shadow-lg flex flex-col h-full`}
        style={{ width: '280px' }}
      >
        {/* Header with Toggle Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-800 text-lg hidden lg:inline">Admin Panel</span>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaBars className="text-gray-600" />
          </button>
        </div>

        {/* Profile Section */}
        {showSidebar && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profilePic || "https://via.placeholder.com/50"}
                  alt="admin"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user?.username || "Admin User"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "admin@example.com"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        {showSidebar && (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </div>
                      {showSidebar && (
                        <span>
                          {expandedMenus[item.name] ? (
                            <FaChevronDown size={12} />
                          ) : (
                            <FaChevronRight size={12} />
                          )}
                        </span>
                      )}
                    </button>
                    
                    {expandedMenus[item.name] && showSidebar && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={sub.path}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                location.pathname === sub.path
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={linkClasses(item.path.split('/').pop() || '')}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {showSidebar && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        {showSidebar && (
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 group"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
            
            <div className="pt-2 text-center">
              <p className="text-xs text-gray-400">© 2024 Admin Panel</p>
              <p className="text-xs text-gray-400">Version 2.0.0</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
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