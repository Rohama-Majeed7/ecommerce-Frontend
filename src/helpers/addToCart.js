import axios from "axios";
import toast from "react-hot-toast";

const addToCart = async (e, id, token) => {
  e?.stopPropagation();
  e?.preventDefault();

  try {
    const response = await axios.post(
      "https://ecommerce-backend-theta-dun.vercel.app/cart/addtocart",
      { productId: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      toast.success(response.data.msg);
      console.log(response.data);
    }
  } catch (error) {
    console.error("Add to cart failed:", error);
    toast.error("Failed to add to cart");
  }
};

export default addToCart;
