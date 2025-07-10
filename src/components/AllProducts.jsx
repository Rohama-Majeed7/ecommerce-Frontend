import React, { useEffect, useState } from "react";
import UploadProduct from "./UploadProduct";
import EditProduct from "./EditProduct";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";

const AllProducts = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProductDetails, setEditProductDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-backend-theta-dun.vercel.app/product/get-products",
          {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
        );
        if (response.status === 200) {
          setProducts(response.data.products);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [value]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://ecommerce-backend-theta-dun.vercel.app/product/delete-product/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data?.msg )

      dispatch(manageState());
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center p-2">
        <h3 className="text-xl font-bold text-[#0A1F44]">All Products</h3>
        <button
          onClick={() => setShowProducts(true)}
          className="transition-all border-2 border-[#0078D7] rounded-full px-4 py-2 hover:bg-[#0078D7] hover:text-white text-[#0078D7] font-semibold"
        >
          Upload Product
        </button>
      </div>

      {showProducts && <UploadProduct onclose={() => setShowProducts(false)} />}

      <section className="grid w-11/12 m-auto custom-scrollbar h-[90vh] pb-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 overflow-y-scroll">
        {products.map((product) => (
          <article
            key={product._id}
            className="flex flex-col justify-between border-2 border-[#0A1F44] p-3 rounded-lg transition hover:bg-[#E0E0E0] hover:text-white cursor-pointer"
          >
            <img
              src={product.productImage?.[0]}
              alt={product.productName}
              className="w-full h-48 object-contain mb-2"
            />
            <h4 className="text-[#0A1F44] capitalize font-bold text-lg">
              {product.productName}
            </h4>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  setEditProductDetails(product);
                  setShowEditProduct(true);
                }}
                className="bg-[#0078D7] px-4 py-1 text-white rounded-md hover:bg-[#0A1F44]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-[#0A1F44] px-4 py-1 rounded-md text-white hover:bg-[#0078D7]"
              >
                Delete
              </button>
            </div>
          </article>
        ))}

        {showEditProduct && (
          <EditProduct
            productData={editProductDetails}
            onClose={() => setShowEditProduct(false)}
          />
        )}
      </section>
    </React.Fragment>
  );
};

export default AllProducts;
