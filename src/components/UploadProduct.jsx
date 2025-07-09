import React, { useState } from "react";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-hot-toast";
import { manageState } from "../store/authSlice";
import { useDispatch } from "react-redux";
import uploadImage from "../helpers/uploadImage";

const UploadProduct = ({ onclose }) => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://ecommerce-backend-theta-dun.vercel.app/product/upload-product",
      data,
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
      setImage(null);
      dispatch(manageState());
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadOnCloud = await uploadImage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadOnCloud.url],
    }));
    setImage(uploadOnCloud.url);
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
      setImage(uploadOnCloud.url);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.productImage];
    updatedImages.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: updatedImages }));
  };

  return (
    <section className="flex h-screen justify-center items-center fixed top-0 w-full bg-slate-500 bg-opacity-20 z-50">
      <form
        onSubmit={handleOnSubmit}
        className="md:w-[550px] w-11/12 bg-white shadow-lg p-4 h-[90vh] custom-scrollbar overflow-y-scroll flex flex-col gap-3 border-2 border-[#0A1F44] rounded-md"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <button
            type="button"
            onClick={onclose}
            className="bg-[#0078D7] hover:bg-[#005BB5] px-3 py-1 rounded-lg text-white"
          >
            Cancel
          </button>
        </div>

        {/* Product Name */}
        <input
          type="text"
          name="productName"
          value={data.productName}
          onChange={handleOnChange}
          placeholder="Product Name"
          className="w-full border border-gray-400 p-2 rounded-md"
        />

        {/* Brand Name */}
        <input
          type="text"
          name="brandName"
          value={data.brandName}
          onChange={handleOnChange}
          placeholder="Brand Name"
          className="w-full border border-gray-400 p-2 rounded-md"
        />

        {/* Category Select */}
        <select
          name="category"
          value={data.category}
          onChange={handleOnChange}
          className="w-full border border-gray-400 p-2 rounded-md"
        >
          <option value="">Select Category</option>
          {productCategory.map((cat, idx) => (
            <option key={idx} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Drag and Drop Image Upload */}
        <label
          htmlFor="uploadImage"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex justify-center items-center h-48 bg-[#0A1F44] rounded-md text-white text-center cursor-pointer"
        >
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
          />
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center">
              <FaCloudUploadAlt className="text-3xl mb-2" />
              <p>Upload or drag & drop image here</p>
            </div>
          )}
        </label>

        {/* Uploaded Images Preview */}
        {data.productImage.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {data.productImage.map((img, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border border-red-300 rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt="product"
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setImageUrl(img);
                    setShowImage(true);
                  }}
                />
                <FaTrashAlt
                  onClick={() => handleDeleteImage(index)}
                  className="absolute bottom-1 right-1 text-red-600 cursor-pointer bg-white rounded-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Large Image Viewer */}
        {showImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-11/12">
              <img src={imageUrl} alt="Large View" className="w-full h-auto" />
              <IoMdClose
                onClick={() => setShowImage(false)}
                className="absolute top-2 right-2 text-xl cursor-pointer bg-white rounded-full hover:bg-red-600 hover:text-white"
              />
            </div>
          </div>
        )}

        {/* Pricing */}
        <input
          type="number"
          name="price"
          value={data.price}
          onChange={handleOnChange}
          placeholder="Price"
          className="w-full border border-gray-400 p-2 rounded-md"
        />

        <input
          type="number"
          name="sellingPrice"
          value={data.sellingPrice}
          onChange={handleOnChange}
          placeholder="Selling Price"
          className="w-full border border-gray-400 p-2 rounded-md"
        />

        {/* Description */}
        <textarea
          name="description"
          value={data.description}
          onChange={handleOnChange}
          placeholder="Product Description"
          className="w-full border border-gray-400 p-2 rounded-md"
        />

        <button
          type="submit"
          className="bg-[#0A1F44] hover:bg-[#0078D7] text-white py-2 rounded-lg"
        >
          Upload Product
        </button>
      </form>
    </section>
  );
};

export default UploadProduct;
