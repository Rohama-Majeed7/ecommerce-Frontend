import axios from "axios";
import toast from "react-hot-toast";
const addToCart = async (e, id) => {
  e?.stopPropagation();
  e?.preventDefault();
  const response = await axios.post(
    "http://localhost:8080/cart/addtocart",
    { productId: id },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  if (response.status === 200) {
    toast.success(response.data.msg);
    console.log(response.data);
  }
};

export default addToCart;
