import axios from "axios";

const fetchCategoryWiseProducts = async (category) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/product/get-category-wiseProduct",
       {category} ,
      {
        headers: {
          "Content-Type": "application/json",
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
