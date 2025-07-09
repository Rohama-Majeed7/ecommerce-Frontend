import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productCategory from "../../helpers/productCategory";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import CategoryWiseProducts from "../CategoryWiseProducts";

const CategoryProducts = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [sortBy, setSortBy] = useState("");

  const selectedCategoryList = Object.entries(selectCategory)
    .filter(([_, checked]) => checked)
    .map(([category]) => category);

  // Fetch filtered products
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategoryList.length > 0) {
        const response = await axios.post(
          "https://ecommerce-backend-theta-dun.vercel.app/product/filter-product",
          { category: selectedCategoryList },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setData(response.data.data);
        }
      } else {
        const products = await fetchCategoryWiseProducts(params?.categoryName);
        setData(products);
      }
    };
    fetchData();
  }, [selectedCategoryList, params?.categoryName]);

  // Handle sort
  useEffect(() => {
    if (sortBy && data.length > 0) {
      const sortedData = [...data].sort((a, b) =>
        sortBy === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice
      );
      setData(sortedData);
    }
  }, [sortBy]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  const handleOnChangeSortBy = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="container mx-auto p-4">
        <div className="hidden lg:grid grid-cols-[200px,1fr] gap-4">
          {/* Sidebar */}
          <aside className="bg-[#0078D7] p-4 rounded-md text-white custom-scrollbar overflow-y-auto min-h-[calc(100vh-100px)]">
            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold border-b pb-2">Sort By</h3>
              <form className="flex flex-col gap-2 mt-2 text-sm">
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="sortBy"
                    value="asc"
                    checked={sortBy === "asc"}
                    onChange={handleOnChangeSortBy}
                  />
                  Price Low to High
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="sortBy"
                    value="dsc"
                    checked={sortBy === "dsc"}
                    onChange={handleOnChangeSortBy}
                  />
                  Price High to Low
                </label>
              </form>
            </div>

            {/* Filter */}
            <div>
              <h3 className="text-xl font-semibold border-b pb-2">Category</h3>
              <form className="flex flex-col gap-2 mt-2 text-sm">
                {productCategory.map((el, index) => (
                  <label key={index} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      value={el.value}
                      onChange={handleSelectCategory}
                    />
                    {el.label}
                  </label>
                ))}
              </form>
            </div>
          </aside>

          {/* Products */}
          <main>
            <CategoryWiseProducts data={data} heading="Recommended Products" />
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CategoryProducts;
