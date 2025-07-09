import React, { useEffect, useState } from "react";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../../store/authSlice";
import AddToWishList from "../AddToWishList";

const VerticalProducts = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.authenticator?.user?.user);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchCategoryWiseProducts(category);
      setData(products);
      setLoading(false);
    };

    fetchProducts();
    dispatch(manageState());
  }, [category]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // Prevent redirect when inside Link
    await addToCart(e, id);
    dispatch(manageState());
  };

  const placeholder = new Array(6).fill(null);

  return (
    <section className="w-11/12 mx-auto my-6">
      <h2 className="text-2xl font-bold text-text mb-4">{heading}</h2>

      <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar">
        {(loading ? placeholder : data)?.map((el, index) => (
          <Link
            to={!loading ? `/single-product/${el?._id}` : "#"}
            key={index}
            className="min-w-[250px] max-w-[250px] bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between gap-3 hover:shadow-lg transition"
          >
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse" />
              ) : (
                <img
                  src={el?.productImage[0]}
                  alt={el?.productName}
                  className="w-full h-full object-contain object-center"
                />
              )}
            </div>

            <div className="text-text">
              {loading ? (
                <div className="h-5 bg-gray-300 w-3/4 rounded animate-pulse" />
              ) : (
                <p className="text-lg font-semibold truncate">{el?.productName}</p>
              )}

              {!loading && (
                <>
                  <div className="mt-2">
                    <AddToWishList product={el} userId={user?._id} />
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, el?._id)}
                    className="bg-primary hover:bg-secondary text-white text-sm font-medium mt-3 py-2 rounded-md transition w-full"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default VerticalProducts;
