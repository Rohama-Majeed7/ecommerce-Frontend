import React, { useEffect, useState } from "react";
import UploadProduct from "./UploadProduct";
import EditProduct from "./EditProduct";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSpinner,
  FaStar,
  FaStarHalf,
  FaStarOfLife,
  FaBox,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import { MdOutlineInventory, MdOutlineAttachMoney } from "react-icons/md";

const AllProducts = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProductDetails, setEditProductDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    fetchProducts();
  }, [value]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecommerce-backend.rohama-majeed7.deno.net/product/get-products",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setProducts(response.data.products || []);
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      const response = await axios.delete(
        `https://ecommerce-backend.rohama-majeed7.deno.net/product/delete-product/${id}`,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data?.msg || "Product deleted successfully");
      dispatch(manageState());
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800", icon: "🔴" };
    if (stock < 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800", icon: "🟡" };
    return { text: "In Stock", color: "bg-green-100 text-green-800", icon: "🟢" };
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.productName?.localeCompare(b.productName);
          break;
        case "price":
          comparison = (a.sellingPrice || 0) - (b.sellingPrice || 0);
          break;
        case "stock":
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        case "date":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const totalProducts = filteredProducts.length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + (p.sellingPrice || 0) * (p.stock || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaBox className="text-primary" />
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            
            <button
              onClick={() => setShowProducts(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus />
              Upload New Product
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
              </div>
              <FaBox className="text-3xl text-primary/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalValue)}</p>
              </div>
              <MdOutlineAttachMoney className="text-3xl text-green-500/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <FaStarOfLife className="text-3xl text-yellow-500/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.stock > 0 && p.stock < 10).length}
                </p>
              </div>
              <MdOutlineInventory className="text-3xl text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter />
              Filters
            </button>
            
            {/* Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-4`}>
              {/* Category Filter */}
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
              
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </select>
              
              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {totalProducts === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No Products Found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your filters" 
                : "Click 'Upload New Product' to add your first product"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48">
                    <img
                      src={product.productImage?.[0]}
                      alt={product.productName}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Stock Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold ${stockStatus.color}`}>
                      {stockStatus.icon} {stockStatus.text}
                    </div>
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.productName}
                    </h3>
                    
                    {/* Rating (if available) */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(product.rating) ? (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ) : i < product.rating ? (
                              <FaStarHalf key={i} className="text-yellow-400 text-sm" />
                            ) : (
                              <FaStar key={i} className="text-gray-300 text-sm" />
                            )
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.sellingPrice)}
                      </span>
                      {product.originalPrice > product.sellingPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Quantity */}
                    {product.stock > 0 && (
                      <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
                        <MdOutlineInventory />
                        <span>Stock: {product.stock} units</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditProductDetails(product);
                          setShowEditProduct(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === product._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showProducts && (
        <UploadProduct onclose={() => {
          setShowProducts(false);
          fetchProducts();
        }} />
      )}

      {showEditProduct && (
        <EditProduct
          productData={editProductDetails}
          onClose={() => {
            setShowEditProduct(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;