import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import addToCart from "../helpers/addToCart";
import { manageState } from "../store/authSlice";

const CategoryWiseProducts = ({ data, heading }) => {
    const token = useSelector((state) => state?.authenticator?.token);

  const dispatch = useDispatch();
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id,token);
    dispatch(manageState());
  };
  return (
    <React.Fragment>
      <section className="w-11/12 mx-auto">
        <Link to={"/"} className="bg-[#005BB5] p-2 rounded-lg my-4 text-white">
          Back to Home
        </Link>
        <h1 className="font-bold  my-3 text-2xl">{heading} </h1>
        <h3 className="font-bold mb-2">Search Results: {data?.length}</h3>
        <main className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3 h-screen custom-scrollbar m-auto overflow-y-scroll ">
          {data.length > 0 ? (
            data?.map((el, index) => {
              return (
                <div
                  to={`/single-product/${el?._id}`}
                  key={index}
                  className="flex gap-3 bg-white rounded-md  flex-col  p-2 border-2 border-[#0A1F44]"
                >
                  <div className=" w-[150px] m-auto">
                    <img
                      src={el?.productImage[0]}
                      className="w-full m-auto"
                      alt={el?.productName}
                    />
                  </div>
                  <div className="bg-white w-full flex flex-col justify-between gap-3">
                    <p className="capitalize font-semibold">{el?.productName}</p>
                    <button
                      onClick={(e) => handleAddToCart(e, el?._id)}
                      className="bg-[#0078D7] text-white px-3 py-1 rounded-lg hover:bg-[#005BB5]"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full bg-slate-400 p-3 text-3xl text-center text-white shadow-lg my-3 font-bold">
              No Data
            </div>
          )}
        </main>
      </section>
    </React.Fragment>
  );
};

export default CategoryWiseProducts;
