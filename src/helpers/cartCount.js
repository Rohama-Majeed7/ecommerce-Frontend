import axios from "axios";
// import toast from "react-hot-toast";

const cartCountItem = async () => {
  const response = await axios.get("https://ecommerce-backend-theta-dun.vercel.app/cart/cartitemcount", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  if (response.status === 200) {
    return response.data.count;
  }
};

export default cartCountItem;
