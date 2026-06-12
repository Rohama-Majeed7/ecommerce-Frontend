import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productCategory from "../../helpers/productCategory";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import CategoryWiseProducts from "../CategoryWiseProducts";
import { useSelector } from "react-redux";
import { FaFilter, FaSort } from "react-icons/fa";

const CategoryProducts = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const token = useSelector((state) => state?.authenticator?.token);

  const selectedCategoryList = Object?.entries(selectCategory)?.filter(([_, checked]) => checked)?.map(([category]) => category);

  // Fetch filtered products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedCategoryList.length > 0) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/product/filter-product`,
            { category: selectedCategoryList },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            setData(response.data.data);
          }
        } else {
          const products = await fetchCategoryWiseProducts(params?.categoryName, token);
          setData(products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params?.categoryName, selectedCategoryList.length]);

  // Handle sort
  useEffect(() => {
    if (sortBy && data.length > 0 && !loading) {
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

  const clearFilters = () => {
    setSelectCategory({});
    setSortBy("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold shadow-md"
          >
            <FaFilter />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className={`
            ${showMobileFilters ? 'block' : 'hidden'} 
            lg:block lg:w-72 bg-white rounded-2xl shadow-md p-5 h-fit sticky top-24
          `}>
            {/* Sort Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaSort className="text-primary" />
                <h3 className="text-lg font-bold text-gray-800">Sort By</h3>
              </div>
              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="asc"
                    checked={sortBy === "asc"}
                    onChange={handleOnChangeSortBy}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Price: Low to High</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="dsc"
                    checked={sortBy === "dsc"}
                    onChange={handleOnChangeSortBy}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Price: High to Low</span>
                </label>
              </div>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaFilter className="text-primary" />
                <h3 className="text-lg font-bold text-gray-800">Categories</h3>
              </div>
              <div className="space-y-2 pl-2 max-h-96 overflow-y-auto">
                {productCategory.map((el, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      value={el.value}
                      onChange={handleSelectCategory}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-gray-700">{el.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(Object.keys(selectCategory).length > 0 || sortBy) && (
              <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Active Filters Display */}
            {(Object.keys(selectCategory).length > 0 || sortBy) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {sortBy && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Sort: {sortBy === "asc" ? "Low to High" : "High to Low"}
                    <button onClick={() => setSortBy("")} className="hover:text-red-500">×</button>
                  </span>
                )}
                {selectedCategoryList.map(cat => (
                  <span key={cat} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {cat}
                    <button 
                      onClick={() => setSelectCategory(prev => ({ ...prev, [cat]: false }))}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-500 text-sm">
                Found <span className="font-semibold text-primary">{data.length}</span> products
              </p>
            </div>

            {/* Products Grid */}
            <CategoryWiseProducts 
              data={data} 
              heading={params?.categoryName || "Recommended Products"} 
              loading={loading}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;