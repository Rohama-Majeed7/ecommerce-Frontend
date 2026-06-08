import React, { useState } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import { FaUserEdit, FaSave, FaSpinner, FaUserTag, FaEnvelope, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";

const EditUser = ({ name, email, role, userId, onClose }) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(role || "");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state?.authenticator?.token);

  const handleOnChange = (e) => {
    setUserRole(e.target.value);
  };

  const handleOnUpdate = async () => {
    if (!userRole) {
      toast.error("Please select a role.", {
        icon: '⚠️',
        duration: 3000,
      });
      return;
    }

    if (userRole === role) {
      toast.error("Role is already set to this value.", {
        icon: 'ℹ️',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecommerce-backend.rohama-majeed7.deno.net/user/update-user",
        { userId, role: userRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg || "User role updated successfully!", {
          icon: '✅',
          duration: 3000,
        });
        dispatch(manageState());
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error(err.response?.data?.msg || "Error updating role. Please try again.", {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '👑';
      case 'user':
        return '👤';
      case 'moderator':
        return '⭐';
      default:
        return '👥';
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaUserEdit className="text-2xl text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Edit User Role</h2>
                <p className="text-white/80 text-sm">Update user permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Information Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
                <p className="text-sm text-gray-500">User ID: {userId?.slice(-8)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-gray-400" />
                <span className="text-gray-600">{email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaUserTag className="text-gray-400" />
                <span className="text-gray-600">Current Role:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleColor(role)}`}>
                  {getRoleIcon(role)} {role}
                </span>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Select New Role
            </label>
            <div className="relative">
              <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <select
                value={userRole}
                onChange={handleOnChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none bg-white"
                disabled={loading}
              >
                <option value="" disabled>Choose a role</option>
                {Object.values(ROLE).map((el) => (
                  <option key={el} value={el}>
                    {getRoleIcon(el)} {el.charAt(0).toUpperCase() + el.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Role Description */}
          {userRole && userRole !== role && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-fadeIn">
              <p className="text-sm text-blue-800">
                {userRole === 'admin' && '⚠️ Admin users have full access to all features including user management and system settings.'}
                {userRole === 'user' && '👤 Regular users can browse products, add to cart, and make purchases.'}
                {userRole === 'moderator' && '⭐ Moderators can manage products and reviews but have limited system access.'}
              </p>
            </div>
          )}

          {/* Warning for Admin Role */}
          {userRole === 'admin' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Warning: Granting admin access gives full system control. Please ensure this is necessary.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleOnUpdate}
              disabled={loading || !userRole || userRole === role}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Update Role</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default EditUser;