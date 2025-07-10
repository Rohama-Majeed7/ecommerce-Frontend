import React, { useEffect, useState } from "react";
import fetchCategoryWiseProducts from "../../helpers/fetchCategoryWiseProducts";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../../store/authSlice";
import AddToWishList from "../AddToWishList";

const HorizontalProducts = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.authenticator?.user);
  const token = useSelector((state) => state?.authenticator?.token);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchCategoryWiseProducts(category,token);
      setData(products);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // Prevent redirect when clicking inside Link
    await addToCart(e, id,token);
    dispatch(manageState());
  };

  const placeholder = new Array(6).fill(null);

  return (
    <section className="w-11/12 mx-auto my-6 capitalize">
      <h2 className="text-2xl font-bold text-text mb-4">{heading}</h2>

      <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-3">
        {(loading ? placeholder : data)?.map((el, index) => (
          <Link
            to={!loading ? `single-product/${el?._id}` : "#"}
            key={index}
            className="min-w-[320px] max-w-[320px] bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex flex-col gap-3 transition hover:shadow-lg"
          >
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse" />
              ) : (
                <img
                  src={el?.productImage[0]}
                  alt={el?.productName}
                  className="w-full h-full "
                />
              )}
            </div>

            <div className="flex flex-col justify-between h-full text-text">
              {loading ? (
                <div className="w-3/4 h-5 bg-gray-300 rounded animate-pulse" />
              ) : (
                <p className="text-lg font-semibold truncate">
                  {el?.productName}
                </p>
              )}

              {!loading && (
                <>
                  <button
                    onClick={(e) => handleAddToCart(e, el?._id)}
                    className="bg-primary hover:bg-secondary text-white text-sm font-medium mt-2 py-2 rounded-md transition"
                  >
                    Add to Cart
                  </button>
                  <div className="mt-2">
                    <AddToWishList product={el} userId={user?._id} />
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HorizontalProducts;
