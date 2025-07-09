import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryLoading = new Array(12).fill(null);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-backend-theta-dun.vercel.app/product/get-category",
          {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
        );
        if (response.status === 200) {
          setCategory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  return (
    <section className="w-11/12 mx-auto my-4">
      <div className="flex gap-4 overflow-x-auto items-center justify-center custom-scrollbar py-2">
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                key={index}
                className="w-20 h-20 rounded-full bg-gray-300 animate-pulse flex-shrink-0"
              ></div>
            ))
          : category?.map((el, index) => (
              <Link
                to={`/get-products/${el?.category}`}
                key={index}
                className="flex flex-col items-center justify-center text-center flex-shrink-0 w-24"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#0078D7] bg-gray-100 hover:scale-110 transition-transform duration-300 p-1">
                  {el?.productImage?.[0] && (
                    <img
                      src={el.productImage[0]}
                      alt={el.category}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <p className="text-sm mt-1 text-[#0A1F44] font-semibold capitalize">
                  {el.category}
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default CategoryList;
