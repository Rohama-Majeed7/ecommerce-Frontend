import React, { useState } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";

const EditUser = ({ name, email, role, userId, onClose }) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(role || "");
  const token = useSelector((state) => state?.authenticator?.token);

  const handleOnChange = (e) => {
    setUserRole(e.target.value);
  };

  const handleOnUpdate = async () => {
    if (!userRole) {
      toast.error("Please select a role.");
      return;
    }

    try {
      const response = await axios.post(
        "https://ecommerce-backend-theta-dun.vercel.app/user/update-user",
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
        toast.success(response.data.msg)
        dispatch(manageState());
        onClose();
      }
    } catch (err) {
      toast.error("Error updating role");
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 w-11/12 md:w-1/3 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-xl text-red-500 hover:text-red-700"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        <h2 className="font-bold text-xl mb-4">Change User Role</h2>

        <div className="mb-3">
          <p>
            <span className="font-semibold">Name:</span> {name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {email}
          </p>
        </div>

        <div className="flex justify-between items-center bg-gray-100 p-3 rounded mb-4">
          <span className="font-medium">Role:</span>
          <select
            value={userRole}
            onChange={handleOnChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="" disabled>
              Select Role
            </option>
            {Object.values(ROLE).map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOnUpdate}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Change Role
        </button>
      </div>
    </section>
  );
};

export default EditUser;
