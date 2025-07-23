import React, { useEffect, useState } from "react";

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
      setOrders(data);
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
    <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-4xl font-bold text-center text-blue-800 mb-10 drop-shadow-sm">
        My Orders
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">
          Loading your orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-blue-700">
                  {order.shopName}
                </h3>
                <p className="text-sm text-gray-500">{order.shopAddress}</p>
              </div>

              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Order ID:</span>{" "}
                  {order._id}
                </p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-1">Items Ordered:</p>
                <ul className="text-sm text-gray-800 list-disc ml-5 space-y-1">
                  {order.orderItems.waterTins > 0 && (
                    <li>Water Tins: {order.orderItems.waterTins}</li>
                  )}
                  {order.orderItems.coolingWaterTins > 0 && (
                    <li>Cooling Tins: {order.orderItems.coolingWaterTins}</li>
                  )}
                  {order.orderItems.waterBottles > 0 && (
                    <li>Water Bottles: {order.orderItems.waterBottles}</li>
                  )}
                  {order.orderItems.waterPackers > 0 && (
                    <li>Water Packers: {order.orderItems.waterPackers}</li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 mb-4">
                <p>
                  💰 <span className="font-medium">Amount:</span> ₹
                  {order.amount}
                </p>
                <p>
                  🧾 <span className="font-medium">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  💳 <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
                <p>
                  📦 <span className="font-medium">Delivery:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      order.deliveryStatus === "Delivered"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {order.deliveryStatus || "Pending"}
                  </span>
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  🚚 <span className="font-medium">Deliver To:</span>{" "}
                  {order.customerName}, {order.userAddress}
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
