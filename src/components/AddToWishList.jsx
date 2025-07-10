import React from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddToWishList = ({ product, userId }) => {
    const token = useSelector((state) => state?.authenticator?.token);

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const response = await axios.post(
        "https://ecommerce-backend-theta-dun.vercel.app/wishlistApi/wishlist",
        {
          userId,
          productId: product._id,
          name: product.productName,
          image: product.productImage,
          price: product.sellingPrice, // use `sellingPrice` instead of `price` if applicable
        },
        {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Added to wishlist!");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Wishlist Error:", err);
      toast.error("Error adding to wishlist");
    }
  };

  return (
    <button onClick={handleAddToWishlist} title="Add to Wishlist">
      <FaHeart className="my-4 group text-red-500 hover:scale-110 transition-transform" />
    </button>
  );
};

export default AddToWishList;
