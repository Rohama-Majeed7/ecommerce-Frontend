import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { manageState } from "../store/authSlice";
import addToCart from "../helpers/addToCart";

const VerticalSearchCard = ({ data }) => {
  const dispatch = useDispatch();
const token = useSelector((state) => state?.authenticator?.token)
  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // Prevent navigation when button inside <Link> is clicked
    await addToCart(e, id,token);
    dispatch(manageState());
  };

  return (
    <section className="w-11/12 mx-auto my-6">
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition"
      >
        Back to Home
      </Link>

      <h1 className="font-bold text-xl mb-4">
        Search results: {data?.length}
      </h1>

      <main className="flex flex-wrap justify-center gap-4">
        {data.length > 0 ? (
          data.map((el) => (
            <Link
              to={`/single-product/${el?._id}`}
              key={el?._id}
              className="bg-white border-2 border-blue-300 rounded-lg p-4 flex flex-col items-center min-w-[250px] max-w-xs hover:shadow-lg transition"
            >
              <div className="w-[150px] h-[150px] mb-3">
                <img
                  src={el?.productImage[0]}
                  alt={el?.productName}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center font-semibold capitalize mb-2">
                {el?.productName}
              </p>
              <button
                onClick={(e) => handleAddToCart(e, el?._id)}
                className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
              >
                Add to cart
              </button>
            </Link>
          ))
        ) : (
          <div className="w-full bg-slate-400 p-4 text-3xl text-center text-white shadow-lg rounded-lg font-bold">
            No Data
          </div>
        )}
      </main>
    </section>
  );
};

export default VerticalSearchCard;
