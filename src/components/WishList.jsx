import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const user = useSelector((state) => state?.authenticator?.user?.user);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-backend-theta-dun.vercel.app/wishlistApi/wishlist/${user?._id}`,
          {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
        );
        setWishlist(response.data.items);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user?._id]);

  const handleRemoveFromWishlist = async (productId, userId) => {
    try {
      await axios.delete(
        `https://ecommerce-backend-theta-dun.vercel.app/wishlistApi/wishlist/${userId}/${productId}`,
       {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
      );
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  return (
    <section className="w-11/12 max-w-[1200px] mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0A1F44]">My Wishlist</h1>
        <Link
          to="/"
          className="bg-[#0078D7] hover:bg-[#005BB5] text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Back to Home
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-10 text-[#0A1F44] font-semibold text-xl">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="border-2 border-[#0078D7] rounded-lg shadow-sm overflow-hidden flex flex-col"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="h-[200px] w-full object-contain p-4 bg-white"
              />
              <div className="p-4 flex flex-col gap-2 text-[#0A1F44]">
                <h2 className="text-lg font-semibold capitalize">{item.name}</h2>
                <p className="text-md text-[#0078D7] font-bold">${item.price}</p>
                <button
                  onClick={() => handleRemoveFromWishlist(item.productId, user?._id)}
                  className="mt-2 bg-[#0078D7] hover:bg-[#005BB5] text-white px-3 py-1 rounded-md transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;
