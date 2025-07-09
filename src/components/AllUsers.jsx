import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUsers } from "../store/authSlice";
import { MdModeEdit } from "react-icons/md";
import moment from "moment";
import ROLE from "../common/role";
import EditUser from "./EditUser";

const AllUsers = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);
  const users = useSelector((state) => state?.authenticator?.users?.users);
  const [updateUser, setUpdateUser] = useState();
  const [openRole, setOpenRole] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-backend-theta-dun.vercel.app/user/all-users",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          dispatch(setUsers(response.data));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [value]);

  return (
    <React.Fragment>
      <h2 className="p-2 font-bold">All Users</h2>
      <table className="w-full mx-auto">
        <thead>
          <tr className="bg-[#0078D7] text-white p-2">
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((el, index) => (
            <tr key={el?._id} className="text-center">
              <td>{index + 1}</td>
              <td>{el?.username}</td>
              <td>{el?.email}</td>
              <td>{el?.role}</td>
              <td>{moment(el?.createdAt).format("LL")}</td>
              <td>
                <button
                  onClick={() => {
                    setUpdateUser(el);
                    setOpenRole(true);
                  }}
                  className="bg-green-100 p-2 rounded-full cursor-pointer hover:bg-[#0A1F44] hover:text-white"
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openRole && (
        <EditUser
          name={updateUser?.username}
          email={updateUser?.email}
          role={updateUser?.role}
          userId={updateUser?._id}
          onClose={() => setOpenRole(false)}
        />
      )}
    </React.Fragment>
  );
};

export default AllUsers;
