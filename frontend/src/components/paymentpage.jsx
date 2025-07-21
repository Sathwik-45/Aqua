import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Navbar from "./Navbar";
const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
const ITEM_PRICES = {
  waterTins: 30,
  coolingWaterTins: 35,
  waterBottles: 20,
  waterPackers: 15,
};
const [selectedMethod, setSelectedMethod] = React.useState("cod"); // cod or upi
  if (!state) {
    return (
      <div className="text-center text-red-600 mt-10">
        Invalid order. Please try again.
      </div>
    );
  }

  const { order, plant, totalAmount } = state;

  const handleConfirm = () => {
    alert(`Order Confirmed!\nThank you for purchasing from ${plant.shopName}`);
    navigate("/"); // Or redirect to order summary page
  };

  return (
    
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <Navbar/>  
      <h2 className="text-2xl font-bold text-blue-700 mt-3 mb-4">Payment Details</h2>
      <div className="mb-4">
        <div className="flex items-center text-gray-600 mb-1">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          {plant.address}
        </div>
        <div className="flex items-center text-gray-600">
          <FaUser className="mr-2" />
          Owner: {plant.ownerName}
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">
          Order Summary:
        </h3>
        <ul className="space-y-1">
          {Object.entries(order)
            .filter(([_, qty]) => qty > 0)
            .map(([item, qty]) => (
              <li key={item} className="text-gray-700">
                {qty} × {item.replace(/([A-Z])/g, " $1")} = ₹
                {qty * (ITEM_PRICES[item] || 0)}
              </li>
            ))}
        </ul>

        <div className="mt-4 text-right font-bold text-blue-700">
          Total: ₹{totalAmount}
        </div>
      </div>
<div className="mb-4">
  <h3 className="text-lg font-semibold text-blue-600 mb-3">
    Choose Payment Method:
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      onClick={() => setSelectedMethod("cod")}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
        selectedMethod === "cod"
          ? "border-blue-600 shadow-md bg-blue-50"
          : "border-gray-200"
      }`}
    >
      <h4 className="font-medium text-lg text-gray-800">Cash on Delivery</h4>
      <p className="text-sm text-gray-500 mt-1">
        Pay when your order is delivered to your address.
      </p>
    </div>

    <div
      onClick={() => setSelectedMethod("upi")}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
        selectedMethod === "upi"
          ? "border-blue-600 shadow-md bg-blue-50"
          : "border-gray-200"
      }`}
    >
      <h4 className="font-medium text-lg text-gray-800">Pay with UPI</h4>
      <p className="text-sm text-gray-500 mt-1">
        Complete payment instantly using your UPI ID.
      </p>
    </div>
  </div>
</div>


      <button
        onClick={handleConfirm}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default PaymentPage;

