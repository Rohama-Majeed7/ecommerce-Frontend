import React from "react";
import SUCCESSIMAGE from "../assets/OtherImgs/success.gif";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="bg-slate-100 w-full max-w-md mx-auto flex flex-col justify-center items-center p-6 rounded-lg shadow-lg text-center">
        <img
          src={SUCCESSIMAGE}
          width={150}
          height={150}
          alt="Success"
          className="mb-4"
        />
        <p className="text-green-600 font-bold text-xl mb-4">
          Payment Successful!
        </p>
        <Link
          to="/order"
          className="px-4 py-2 border-2 border-green-600 rounded font-semibold text-green-600 hover:bg-green-600 hover:text-white transition"
        >
          See Your Orders
        </Link>
      </div>
    </div>
  );
};

export default Success;
