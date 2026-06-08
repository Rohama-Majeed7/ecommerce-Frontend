import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUsers } from "../store/authSlice";
import { MdModeEdit, MdDelete, MdSearch, MdFilterList } from "react-icons/md";
import { FaUserGraduate, FaUsers, FaUserCheck, FaUserClock, FaSpinner } from "react-icons/fa";
import moment from "moment";
import ROLE from "../common/role";
import EditUser from "./EditUser";
import { toast } from "react-hot-toast";

const AllUsers = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);
  const users = useSelector((state) => state?.authenticator?.users?.users);
  const [updateUser, setUpdateUser] = useState();
  const [openRole, setOpenRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    fetchUsers();
  }, [value]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecommerce-backend.rohama-majeed7.deno.net/user/all-users",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(setUsers(response.data));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;
    
    setDeletingId(userId);
    try {
      const response = await axios.delete(
        `https://ecommerce-backend.rohama-majeed7.deno.net/user/delete-user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      toast.success(response.data?.msg || "User deleted successfully");
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.msg || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { color: 'bg-purple-100 text-purple-800', icon: <FaUserGraduate />, label: 'Admin' };
      case 'user':
        return { color: 'bg-blue-100 text-blue-800', icon: <FaUserCheck />, label: 'User' };
      case 'moderator':
        return { color: 'bg-green-100 text-green-800', icon: <FaUsers />, label: 'Moderator' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <FaUserClock />, label: role || 'User' };
    }
  };

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user?.role?.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  const statistics = {
    total: users?.length || 0,
    admins: users?.filter(u => u?.role === 'admin').length || 0,
    users: users?.filter(u => u?.role === 'user').length || 0,
    newThisMonth: users?.filter(u => moment(u?.createdAt).isAfter(moment().subtract(30, 'days'))).length || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaUsers className="text-primary" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all registered users</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
              </div>
              <FaUsers className="text-3xl text-primary/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.admins}</p>
              </div>
              <FaUserGraduate className="text-3xl text-purple-500/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Regular Users</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.users}</p>
              </div>
              <FaUserCheck className="text-3xl text-blue-500/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-green-600">{statistics.newThisMonth}</p>
              </div>
              <FaUserClock className="text-3xl text-green-500/30" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <MdFilterList />
              Filters
            </button>
            
            {/* Role Filter */}
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex`}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No Users Found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || selectedRole !== "all" 
                ? "Try adjusting your search filters" 
                : "No users have registered yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Last Active</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers?.map((user, index) => {
                    const roleBadge = getRoleBadge(user?.role);
                    return (
                      <tr key={user?._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold">
                              {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user?.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user?.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                            {roleBadge.icon}
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {moment(user?.createdAt).format("MMM DD, YYYY")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user?.lastActive ? moment(user.lastActive).fromNow() : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setUpdateUser(user);
                                setOpenRole(true);
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
                              title="Edit User"
                            >
                              <MdModeEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user?._id, user?.username)}
                              disabled={deletingId === user?._id}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 disabled:opacity-50"
                              title="Delete User"
                            >
                              {deletingId === user?._id ? (
                                <FaSpinner className="animate-spin" size={18} />
                              ) : (
                                <MdDelete size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredUsers?.map((user, index) => {
                const roleBadge = getRoleBadge(user?.role);
                return (
                  <div key={user?._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user?.username}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setUpdateUser(user);
                            setOpenRole(true);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <MdModeEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?._id, user?.username)}
                          disabled={deletingId === user?._id}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          {deletingId === user?._id ? (
                            <FaSpinner className="animate-spin" size={16} />
                          ) : (
                            <MdDelete size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Role</p>
                        <span className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                          {roleBadge.icon}
                          {roleBadge.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Joined</p>
                        <p className="text-gray-700 mt-1">{moment(user?.createdAt).format("MMM DD, YYYY")}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Last Active</p>
                        <p className="text-gray-700 mt-1">{user?.lastActive ? moment(user.lastActive).fromNow() : 'Never'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Footer with Pagination (Optional) */}
            {filteredUsers?.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Showing {filteredUsers.length} of {users?.length} users</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90">
                      1
                    </button>
                    <button className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {openRole && (
        <EditUser
          name={updateUser?.username}
          email={updateUser?.email}
          role={updateUser?.role}
          userId={updateUser?._id}
          onClose={() => {
            setOpenRole(false);
            fetchUsers(); // Refresh after edit
          }}
        />
      )}
    </div>
  );
};

export default AllUsers;