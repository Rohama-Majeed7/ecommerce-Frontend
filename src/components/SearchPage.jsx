import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import VerticalSearchCard from "./VerticalSearchCard";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import { FaSearch, FaArrowLeft, FaSpinner, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { toast } from "react-hot-toast";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);
  const token = useSelector((state) => state?.authenticator?.token);

  const fetchData = async () => {
    if (!searchQuery) {
      setLoading(false);
      setData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://ecommerce-backend.rohama-majeed7.deno.net/product/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const products = response.data.products || [];
        setData(products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Reset filters when new search is performed
        setSelectedCategory("all");
        setPriceRange({ min: 0, max: 1000 });
        setSortBy("default");
      }
    } catch (err) {
      console.error("Error fetching search data:", err);
      toast.error("Failed to load search results");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, value]);

  // Filter and sort products
  useEffect(() => {
    let results = [...data];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    // Apply price filter
    results = results.filter(product => {
      const price = product.sellingPrice || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Apply sorting
    switch (sortBy) {
      case "name":
        results.sort((a, b) => {
          const comparison = (a.productName || '').localeCompare(b.productName || '');
          return sortOrder === "asc" ? comparison : -comparison;
        });
        break;
      case "price":
        results.sort((a, b) => {
          const comparison = (a.sellingPrice || 0) - (b.sellingPrice || 0);
          return sortOrder === "asc" ? comparison : -comparison;
        });
        break;
      case "rating":
        results.sort((a, b) => {
          const ratingA = a.averageRating || 0;
          const ratingB = b.averageRating || 0;
          const comparison = ratingA - ratingB;
          return sortOrder === "asc" ? comparison : -comparison;
        });
        break;
      default:
        // Keep original order (by relevance)
        break;
    }
    
    setFilteredData(results);
  }, [data, selectedCategory, priceRange, sortBy, sortOrder]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getPriceRangeOptions = () => {
    if (data.length === 0) return [];
    const prices = data.map(p => p.sellingPrice || 0);
    const maxPrice = Math.max(...prices);
    return [
      { label: "All", min: 0, max: maxPrice },
      { label: "Under $25", min: 0, max: 25 },
      { label: "$25 - $50", min: 25, max: 50 },
      { label: "$50 - $100", min: 50, max: 100 },
      { label: "Over $100", min: 100, max: maxPrice },
    ];
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={handleBack} className="text-gray-600 hover:text-primary transition-colors">
              <FaArrowLeft />
            </button>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FaSearch className="text-primary" />
                  Search Results
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {searchQuery && (
                    <>Showing results for: <span className="font-semibold text-primary">"{searchQuery}"</span></>
                  )}
                </p>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm text-gray-600">
                Found <span className="font-bold text-primary">{filteredData.length}</span> products
              </span>
            </div>
          </div>
        </div>

        {/* Search Query Display */}
        {searchQuery && data.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              No results found for "{searchQuery}". Try different keywords or browse our categories.
            </p>
          </div>
        )}

        {/* Filters and Sort Section */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter />
                Filters & Sort
              </button>
              
              <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-4 w-full`}>
                {/* Category Filter */}
                {categories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
                
                {/* Price Range Filter */}
                <select
                  value={`${priceRange.min}-${priceRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setPriceRange({ min, max });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  {getPriceRangeOptions().map(option => (
                    <option key={option.label} value={`${option.min}-${option.max}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="default">Sort by: Relevance</option>
                  <option value="name">Sort by: Name</option>
                  <option value="price">Sort by: Price</option>
                  <option value="rating">Sort by: Rating</option>
                </select>
                
                {/* Sort Order */}
                {sortBy !== "default" && (
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {filteredData.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MdOutlineProductionQuantityLimits className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">
              No products found
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}".`
                : "Enter a search term to find products."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Products
              </button>
              {searchQuery && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : (
          <VerticalSearchCard data={filteredData} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;