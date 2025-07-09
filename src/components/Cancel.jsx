import React from "react";
import { Link } from "react-router-dom";
import CANCELIMAGE from "../assets/OtherImgs/cancel.gif";

const Cancel = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-md w-full flex flex-col items-center text-center">
        <img
          src={CANCELIMAGE}
          alt="Payment Cancelled"
          width={150}
          height={150}
          className="mix-blend-multiply mb-4"
        />
        <p className="text-2xl font-bold text-red-600 mb-2">
          Payment Cancelled
        </p>
        <p className="text-gray-600">Your transaction was not completed.</p>
        <Link
          to="/cart"
          className="mt-5 px-4 py-2 border-2 border-red-600 text-red-600 font-semibold rounded hover:bg-red-600 hover:text-white transition duration-300"
        >
          Back to Cart
        </Link>
      </div>
    </section>
  );
};

export default Cancel;
