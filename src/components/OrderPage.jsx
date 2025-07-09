import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

const OrderPage = () => {
  const [data, setData] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get("https://ecommerce-backend-theta-dun.vercel.app/user/order-list",
       {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setData(response.data.data || []);
        console.log("Orders:", response.data.data);
      }
    } catch (err) {
      console.error("Error fetching order list:", err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="w-11/12 mx-auto my-6 min-h-screen">
      {data.length === 0 ? (
        <p className="text-center text-xl font-semibold text-gray-500">
          No orders available.
        </p>
      ) : (
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={`${item.userId}-${index}`} className="border rounded-lg p-4 shadow-md bg-white">
              <p className="text-blue-700 font-semibold text-lg mb-2">
                Order Date: {moment(item.createdAt).format("LL")}
              </p>

              <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Product Details */}
                <div className="space-y-3 w-full lg:w-2/3">
                  {item?.productDetails.map((product, i) => (
                    <div
                      key={`${product.productId}-${i}`}
                      className="flex gap-4 border border-[#0A1F44] p-2 rounded-md bg-slate-100"
                    >
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-24 h-24 object-contain bg-white border rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1">{product.name}</h4>
                        <div className="flex gap-6 mt-1 text-sm text-gray-600">
                          <p className="text-[#0078D7] font-medium">Price: ${product.price}</p>
                          <p>Qty: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment & Shipping */}
                <div className="w-full lg:w-1/3 space-y-4 p-2">
                  <div>
                    <h3 className="text-lg font-bold">Payment Details</h3>
                    <p className="ml-1">Method: {item.paymentDetails?.payment_method_type?.[0]}</p>
                    <p className="ml-1">Status: {item.paymentDetails?.payment_status}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Shipping Details</h3>
                    {item.shipping_options.map((shipping) => (
                      <div key={shipping.shipping_rate} className="ml-1">
                        Shipping Amount: ${shipping.shipping_amount}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right font-bold text-lg text-gray-700 mt-4">
                Total: ${item.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
