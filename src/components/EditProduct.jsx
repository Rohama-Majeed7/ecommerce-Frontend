import React, { useState } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import uploadImage from "../helpers/uploadImage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { manageState } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const EditProduct = ({ productData, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecommerce-backend-theta-dun.vercel.app/product/update-product",
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
        toast.success(response.data.msg);
        setData({
          productName: "",
          brandName: "",
          category: "",
          productImage: [],
          description: "",
          price: "",
          sellingPrice: "",
        });
        dispatch(manageState());
        onClose(); // auto-close modal
      }
    } catch (err) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const uploadOnCloud = await uploadImage(file);
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadOnCloud.url],
      }));
    } else {
      toast.error("Only image files are allowed.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const uploadOnCloud = await uploadImage(file);
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadOnCloud.url],
      }));
    } else {
      toast.error("Only image files are allowed.");
    }
  };

  const OnDeleteImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: newImages }));
  };

  return (
    <section className="flex justify-center items-center fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50">
      <form
        onSubmit={handleOnSubmit}
        className="bg-white p-5 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto rounded shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Edit Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Product Name */}
          <div>
            <label htmlFor="productName">Product name:</label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={data.productName}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label htmlFor="brandName">Brand name:</label>
            <input
              type="text"
              name="brandName"
              id="brandName"
              value={data.brandName}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={data.category}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {productCategory.map((el, idx) => (
                <option key={idx} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image Upload */}
          <div>
            <label>Upload Image:</label>
            <label
              htmlFor="uploadImage"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="cursor-pointer flex justify-center items-center bg-gray-100 p-4 rounded border border-dashed"
            >
              <FaCloudUploadAlt className="text-3xl mr-2" />
              <span>Click or Drag & Drop image here</span>
              <input
                type="file"
                id="uploadImage"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />
            </label>
          </div>

          {/* Display Uploaded Images */}
          {data.productImage.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.productImage.map((img, i) => (
                <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img
                    src={img}
                    alt="product"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setImageUrl(img);
                      setShowImage(true);
                    }}
                  />
                  <FaTrashAlt
                    onClick={() => OnDeleteImage(i)}
                    className="absolute bottom-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              name="price"
              id="price"
              value={data.price}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="sellingPrice">Selling Price:</label>
            <input
              type="number"
              name="sellingPrice"
              id="sellingPrice"
              value={data.sellingPrice}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={data.description}
              onChange={handleOnChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Updating..." : "Edit Product"}
          </button>
        </div>
      </form>

      {/* Fullscreen Image Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
          <div className="relative w-11/12 max-w-2xl">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full rounded-md shadow-lg"
            />
            <IoMdClose
              onClick={() => setShowImage(false)}
              className="absolute top-2 right-2 text-white text-3xl cursor-pointer hover:text-red-400"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default EditProduct;
