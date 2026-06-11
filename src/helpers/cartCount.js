import axios from "axios";
// import toast from "react-hot-toast";

const cartCountItem = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/cartitemcount`, {
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
