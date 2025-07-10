import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const profilePic = useSelector((state) => state.authenticator.profilePic);
  const user = useSelector((state) => state.authenticator?.user);
  const [showSidebar, setShowSidebar] = useState(true);

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md transition ${
      location.pathname.includes(path)
        ? "bg-[#0078D7] text-white"
        : "hover:bg-[#0078D7] hover:text-white"
    }`;

  return (
    <aside className="h-screen bg-white border-r-2 border-[#0078D7] shadow-md  ">
      {/* Toggle Button */}
      <div className="p-4 flex items-center justify-between">
        <FaBars
          className="text-2xl cursor-pointer text-[#0078D7]"
          onClick={() => setShowSidebar((prev) => !prev)}
        />
      </div>

      {/* Sidebar Content */}
      {showSidebar && (
        <div className="px-4">
          {/* Profile */}
          <div className="text-center mb-4">
            <img
              src={profilePic}
              alt="admin"
              className="h-20 w-20 rounded-full mx-auto border-2 border-[#0078D7] shadow-md"
            />
            <h2 className="mt-2 text-[#0A1F44] font-bold">{user?.username}</h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 text-[#0A1F44] font-semibold">
            <Link to="users" className={linkClasses("users")}>
              Users
            </Link>
            <Link to="products" className={linkClasses("products")}>
              Products
            </Link>
            <Link to="orders" className={linkClasses("orders")}>
              Orders
            </Link>
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
