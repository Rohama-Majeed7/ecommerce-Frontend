import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import { 
  FaBox, 
  FaCreditCard, 
  FaTruck, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaReceipt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPrint,
  FaEye
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const token = useSelector((state) => state?.authenticator?.token);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/all-order`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'unpaid':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const downloadInvoice = (order) => {
    // Create invoice HTML content
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .order-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Invoice</h1>
            <p>Order #${order._id}</p>
          </div>
          <div class="order-info">
            <p><strong>Date:</strong> ${moment(order.createdAt).format('LLL')}</p>
            <p><strong>Status:</strong> ${order.order_status}</p>
          </div>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${order.productDetails.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>${formatPrice(product.price)}</td>
                  <td>${formatPrice(product.price * product.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Total: ${formatPrice(order.totalAmount)}</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order._id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded!");
  };

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <button onclick="window.print()">Print</button>
          <h1>Order Details</h1>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${moment(order.createdAt).format('LLL')}</p>
          <hr/>
          ${order.productDetails.map(product => `
            <div style="margin-bottom: 20px;">
              <img src="${product.image[0]}" style="width: 100px;"/>
              <h3>${product.name}</h3>
              <p>Quantity: ${product.quantity}</p>
              <p>Price: ${formatPrice(product.price)}</p>
            </div>
          `).join('')}
          <hr/>
          <h3>Total: ${formatPrice(order.totalAmount)}</h3>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.order_status?.toLowerCase() === selectedStatus);

  const statusOptions = [
    { value: "all", label: "All Orders", color: "bg-gray-600" },
    { value: "pending", label: "Pending", color: "bg-orange-500" },
    { value: "processing", label: "Processing", color: "bg-yellow-500" },
    { value: "shipped", label: "Shipped", color: "bg-blue-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaReceipt className="text-primary" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedStatus === status.value
                      ? `${status.color} text-white shadow-md transform scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {status.label}
                  {selectedStatus === status.value && (
                    <span className="ml-2 bg-white/20 px-1 rounded-full text-xs">
                      {filteredOrders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              No Orders Available
            </p>
            <p className="text-gray-400 mt-2">
              {selectedStatus !== "all" 
                ? `No ${selectedStatus} orders found.` 
                : "Start shopping to see your orders here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div
                key={order._id + index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 md:p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-primary" />
                          {moment(order.createdAt).format("LL")}
                        </span>
                        <span className="text-sm text-gray-500">
                          Order #{order._id.slice(-8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                          {order.order_status?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FaDownload />
                        <span className="hidden sm:inline">Invoice</span>
                      </button>
                      <button
                        onClick={() => printOrder(order)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FaPrint />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                      <button
                        onClick={() => toggleOrderExpand(order._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {expandedOrders[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                        <span className="hidden sm:inline">
                          {expandedOrders[order._id] ? "Show Less" : "Show More"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaBox className="text-primary" />
                        Products ({order.productDetails.length})
                      </h3>
                      <div className="space-y-3">
                        {order.productDetails.map((product, i) => (
                          <div
                            key={product.productId + i}
                            className="flex gap-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              className="w-20 h-20 object-contain bg-white rounded-lg shadow-sm"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Qty: {product.quantity}
                              </p>
                              <p className="text-primary font-semibold mt-1">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 space-y-4">
                      {/* Payment Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <FaCreditCard className="text-primary" />
                          Payment Details
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="font-semibold capitalize">
                              {order.paymentDetails.payment_method_type?.[0] || 'N/A'}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-semibold capitalize px-2 py-0.5 rounded ${getPaymentStatusColor(order.paymentDetails.payment_status)}`}>
                              {order.paymentDetails.payment_status || 'N/A'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <FaTruck className="text-primary" />
                          Shipping Info
                        </h4>
                        <div className="space-y-1 text-sm">
                          {order.shipping_options?.map((ship, idx) => (
                            <p key={idx} className="flex justify-between">
                              <span className="text-gray-600">Shipping Cost:</span>
                              <span className="font-semibold">
                                {formatPrice(ship.shipping_amount)}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrders[order._id] && (
                        <>
                          {/* Address Info */}
                          {order.shipping_address && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" />
                                Shipping Address
                              </h4>
                              <div className="text-sm text-gray-600">
                                <p>{order.shipping_address.street}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                                <p>{order.shipping_address.zipCode}</p>
                                <p>{order.shipping_address.country}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Order Timeline */}
                          {order.timeline && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">Order Timeline</h4>
                              <div className="space-y-2 text-sm">
                                {order.timeline.map((event, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                                    <div>
                                      <p className="font-medium">{event.status}</p>
                                      <p className="text-xs text-gray-500">
                                        {moment(event.date).format('LLL')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrder;