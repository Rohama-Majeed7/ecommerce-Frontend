import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import { 
  FaBox, 
  FaCreditCard, 
  FaTruck, 
  FaCalendarAlt, 
  FaReceipt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPrint,
  FaSpinner,
  FaShoppingBag,
  FaRegSadTear
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);
  
  const token = useSelector((state) => state?.authenticator?.token);
  const user = useSelector((state) => state?.authenticator?.user);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/order-list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching order list:", err);
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

  const downloadInvoice = async (order, orderId) => {
    setDownloadingInvoice(orderId);
    
    // Simulate invoice generation (replace with actual API call if needed)
    setTimeout(() => {
      const invoiceHtml = `
        <html>
          <head>
            <title>Invoice #${orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f5f5f5; }
              .total { text-align: right; font-size: 18px; font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice</h1>
              <p>Order #${orderId.slice(-8)}</p>
            </div>
            <div class="order-info">
              <p><strong>Date:</strong> ${moment(order.createdAt).format('LLL')}</p>
              <p><strong>Status:</strong> ${order.order_status || 'Completed'}</p>
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
            <div class="footer">
              <p>Thank you for shopping with us!</p>
            </div>
          </body>
        </html>
      `;
      
      const blob = new Blob([invoiceHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!");
      setDownloadingInvoice(null);
    }, 1000);
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
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <button onclick="window.print()" style="margin-bottom: 20px;">Print</button>
          <div class="header">
            <h1>Order Details</h1>
            <p>Order #${order._id.slice(-8)}</p>
            <p>Date: ${moment(order.createdAt).format('LLL')}</p>
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
          <h3>Total: ${formatPrice(order.totalAmount)}</h3>
          <hr/>
          <p><strong>Payment Method:</strong> ${order.paymentDetails?.payment_method_type?.[0]}</p>
          <p><strong>Payment Status:</strong> ${order.paymentDetails?.payment_status}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FaReceipt className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                My Orders
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <FaRegSadTear className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">
              No orders yet
            </p>
            <p className="text-gray-400 text-sm mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              <FaShoppingBag />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((item, index) => (
              <div
                key={`${item.userId}-${index}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 md:p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-primary" />
                          {moment(item.createdAt).format("LL")}
                        </span>
                        <span className="text-sm text-gray-500">
                          Order #{item._id?.slice(-8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.order_status)}`}>
                          {item.order_status?.toUpperCase() || "COMPLETED"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadInvoice(item, item._id)}
                        disabled={downloadingInvoice === item._id}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {downloadingInvoice === item._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                        <span className="hidden sm:inline">Invoice</span>
                      </button>
                      <button
                        onClick={() => printOrder(item)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FaPrint />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                      <button
                        onClick={() => toggleOrderExpand(item._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {expandedOrders[item._id] ? <FaChevronUp /> : <FaChevronDown />}
                        <span className="hidden sm:inline">
                          {expandedOrders[item._id] ? "Show Less" : "Show More"}
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
                        Products ({item.productDetails.length})
                      </h3>
                      <div className="space-y-3">
                        {item.productDetails.map((product, i) => (
                          <div
                            key={`${product.productId}-${i}`}
                            className="flex gap-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              className="w-20 h-20 object-contain bg-white rounded-lg shadow-sm"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 line-clamp-1">
                                {product.name}
                              </h4>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                <p className="text-primary font-semibold">
                                  {formatPrice(product.price)}
                                </p>
                                <p className="text-gray-600">
                                  Qty: {product.quantity}
                                </p>
                                <p className="text-gray-600 font-semibold">
                                  Total: {formatPrice(product.price * product.quantity)}
                                </p>
                              </div>
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
                              {item.paymentDetails?.payment_method_type?.[0] || 'N/A'}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-semibold capitalize px-2 py-0.5 rounded ${getPaymentStatusColor(item.paymentDetails?.payment_status)}`}>
                              {item.paymentDetails?.payment_status || 'N/A'}
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
                          {item.shipping_options?.map((shipping, idx) => (
                            <p key={idx} className="flex justify-between">
                              <span className="text-gray-600">Shipping Cost:</span>
                              <span className="font-semibold">
                                {formatPrice(shipping.shipping_amount)}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrders[item._id] && (
                        <>
                          {/* Address Info */}
                          {item.shipping_address && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Shipping Address
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>{item.shipping_address.street}</p>
                                <p>{item.shipping_address.city}, {item.shipping_address.state}</p>
                                <p>{item.shipping_address.zipCode}</p>
                                <p>{item.shipping_address.country}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Order Timeline */}
                          {item.timeline && item.timeline.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-3">Order Timeline</h4>
                              <div className="space-y-3">
                                {item.timeline.map((event, idx) => (
                                  <div key={idx} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{event.status}</p>
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
                      {formatPrice(item.totalAmount)}
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

export default OrderPage;