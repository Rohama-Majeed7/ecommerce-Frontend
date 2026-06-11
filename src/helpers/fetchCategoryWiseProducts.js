import axios from "axios";

const fetchCategoryWiseProducts = async (category,token) => {

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/product/get-category-wiseProduct`,
       {category} ,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data.products;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export default fetchCategoryWiseProducts;
