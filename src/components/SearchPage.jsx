import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import VerticalSearchCard from "./VerticalSearchCard";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";

const SearchPage = () => {
  const location = useLocation();
  const query = location.search; // ?search=airpods
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://ecommerce-backend-theta-dun.vercel.app/product/search${query}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Fetched:", response.data.products);
        setData(response.data.products || []);
        // dispatch(manageState())  // Uncomment if required for refresh state sync
      }
    } catch (err) {
      console.error("Error fetching search data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, value]);

  return (
    <div className="w-11/12 mx-auto my-6 min-h-screen">
      {loading ? (
        <p className="text-center font-medium text-gray-500">Loading...</p>
      ) : (
        <VerticalSearchCard data={data} />
      )}
    </div>
  );
};

export default SearchPage;
