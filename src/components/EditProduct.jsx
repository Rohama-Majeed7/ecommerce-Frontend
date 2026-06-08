import React, { useState } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt, FaTrashAlt, FaSpinner, FaSave, FaTimes, FaImage, FaDollarSign, FaTag, FaInfoCircle } from "react-icons/fa";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import uploadImage from "../helpers/uploadImage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { manageState } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const EditProduct = ({ productData, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const token = useSelector((state) => state?.authenticator?.token);

  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    price: productData?.price || "",
    sellingPrice: productData?.sellingPrice || "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "productName":
        if (!value) return "Product name is required";
        if (value.length < 3) return "Product name must be at least 3 characters";
        return "";
      case "brandName":
        if (!value) return "Brand name is required";
        return "";
      case "category":
        if (!value) return "Category is required";
        return "";
      case "price":
        if (!value || value <= 0) return "Price must be greater than 0";
        return "";
      case "sellingPrice":
        if (!value || value <= 0) return "Selling price must be greater than 0";
        if (value > data.price) return "Selling price cannot be greater than original price";
        return "";
      case "description":
        if (!value) return "Description is required";
        if (value.length < 20) return "Description must be at least 20 characters";
        return "";
      default:
        return "";
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(data).forEach(key => {
      if (key !== 'productImage') {
        const error = validateField(key, data[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecommerce-backend.rohama-majeed7.deno.net/product/update-product",
        { ...data, _id: productData._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg || "Product updated successfully!");
        dispatch(manageState());
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    setUploadingImage(true);
    try {
      const uploadOnCloud = await uploadImage(file);
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadOnCloud.url],
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    setUploadingImage(true);
    try {
      const uploadOnCloud = await uploadImage(file);
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadOnCloud.url],
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const OnDeleteImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: newImages }));
    toast.success("Image removed");
  };

  const discount = data.price && data.sellingPrice 
    ? ((data.price - data.sellingPrice) / data.price * 100).toFixed(0)
    : 0;

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <form
        onSubmit={handleOnSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HiOutlineShoppingBag className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">Edit Product</h2>
              <p className="text-white/80 text-sm">Update product information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className={`w-full px-4 py-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
              placeholder="Enter product name"
              required
            />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
            )}
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className={`w-full px-4 py-2 border ${errors.brandName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
              placeholder="Enter brand name"
              required
            />
            {errors.brandName && (
              <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
              required
            >
              <option value="">Select Category</option>
              {productCategory.map((el, idx) => (
                <option key={idx} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>
            
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50"
            >
              <label htmlFor="uploadImage" className="cursor-pointer block">
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin text-3xl text-primary mb-2" />
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <MdOutlineDriveFolderUpload className="text-4xl text-primary mb-2" />
                    <p className="text-sm text-gray-600">
                      Click or drag & drop to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPG, PNG, GIF (Max 2MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Image Gallery */}
            {data.productImage.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {data.productImage.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {data.productImage.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer">
                        <img
                          src={img}
                          alt={`Product ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onClick={() => {
                            setImageUrl(img);
                            setShowImage(true);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => OnDeleteImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="sellingPrice"
                  value={data.sellingPrice}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              {errors.sellingPrice && (
                <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>
              )}
            </div>
          </div>

          {/* Discount Preview */}
          {discount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                💰 Discount: {discount}% off (Save ${(data.price - data.sellingPrice).toFixed(2)})
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={data.description}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none`}
              placeholder="Enter product description (minimum 20 characters)"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {data.description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Fullscreen Image Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setShowImage(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default EditProduct;