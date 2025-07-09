import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state?.authenticator?.token);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get("https://ecommerce-backend-theta-dun.vercel.app/user/all-order", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
      );
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="h-[calc(100vh-190px)] overflow-y-auto custom-scrollbar p-4">
      {!orders.length && (
        <p className="text-center text-gray-500 font-semibold text-lg">
          No Orders Available
        </p>
      )}

      {orders.map((order, index) => (
        <div key={order._id + index} className="mb-6 border rounded p-4 bg-white shadow-sm">
          <p className="font-semibold text-[#0A1F44] text-xl mb-2">
            Order Date: {moment(order.createdAt).format("LL")}
          </p>

          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Product Details */}
            <div className="flex flex-col gap-3">
              {order.productDetails.map((product, i) => (
                <div
                  key={product.productId + i}
                  className="flex gap-3 bg-gray-100 p-2 rounded"
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-24 h-24 object-contain bg-white rounded"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-[#0A1F44] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-red-600 font-semibold">
                      ${product.price}
                    </p>
                    <p>Qty: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment & Shipping */}
            <div className="flex flex-col gap-4 min-w-[250px]">
              <div>
                <h4 className="font-bold text-[#0078D7] mb-1">
                  Payment Details
                </h4>
                <p>
                  Method:{" "}
                  <span className="font-semibold capitalize">
                    {order.paymentDetails.payment_method_type?.[0]}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-semibold capitalize">
                    {order.paymentDetails.payment_status}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0078D7] mb-1">
                  Shipping Info
                </h4>
                {order.shipping_options.map((ship, idx) => (
                  <p key={ship.shipping_rate}>
                    Shipping: ${ship.shipping_amount}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-right font-bold text-lg text-[#0A1F44]">
            Total: ${order.totalAmount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrder;
