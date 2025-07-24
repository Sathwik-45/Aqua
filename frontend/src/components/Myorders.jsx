import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaRupeeSign, FaMoneyBillWave, FaTruck } from "react-icons/fa";

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchOrders = async () => {
  try {
    const phone = localStorage.getItem("phone");
    const response = await fetch(
      `http://localhost:5000/api/orders?phone=${phone}`
    );

    if (!response.ok) throw new Error("Failed to fetch orders");

    const data = await response.json();

    // Sort by date: newest first
    const sortedOrders = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setOrders(sortedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 sm:p-10 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12 drop-shadow-md tracking-wide">
         My Orders
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 text-lg animate-pulse">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You haven’t placed any orders yet.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white border-t-4 border-blue-500 rounded-2xl shadow-md p-6 hover:shadow-2xl transition duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shop Details */}
              <div className="mb-5">
                <h3 className="text-2xl font-semibold text-blue-700">{order.shopName}</h3>
                <p className="text-sm text-gray-500">{order.shopAddress}</p>
              </div>

              {/* Meta Info */}
              <div className="text-sm text-gray-600 mb-5 space-y-1">
                <p><span className="font-medium text-gray-700">Order ID:</span> {order._id}</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Items Ordered */}
              <div className="mb-4">
                <p className="text-gray-700 font-semibold mb-2">🧾 Items Ordered:</p>
                <ul className="list-disc ml-6 text-sm space-y-1 text-gray-800">
                  {order.orderItems.waterTins > 0 && <li>Water Tins: {order.orderItems.waterTins}</li>}
                  {order.orderItems.coolingWaterTins > 0 && <li>Cooling Tins: {order.orderItems.coolingWaterTins}</li>}
                  {order.orderItems.waterBottles > 0 && <li>Water Bottles: {order.orderItems.waterBottles}</li>}
                  {order.orderItems.waterPackers > 0 && <li>Water Packers: {order.orderItems.waterPackers}</li>}
                </ul>
              </div>

              {/* Summary Info */}
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <FaRupeeSign className="text-green-600" />
                  <span className="font-medium">Amount:</span> ₹{order.amount}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-yellow-600" />
                  <span className="font-medium">Payment:</span> {order.paymentMethod}
                </p>
                <p className="flex items-center gap-2">
                  
         
                  <span
                    className={`inline-block px-2 py-1 text-white text-xs rounded-full font-semibold transition ${
                      order.deliveryStatus === "Delivered"
                        ? "bg-green-600"
                        : "bg-yellow-500 animate-pulse"
                    }`}
                  >
                    {order.deliveryStatus || "Pending"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myorders;
