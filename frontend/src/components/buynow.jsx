import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaMapMarkerAlt,
  FaUser,
  FaStar,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

// Prices per item
const ITEM_PRICES = {
  waterTins: 20,
  coolingWaterTins: 30,
  waterBottles: 10,
  waterPackers: 200,
};

const BuyNowPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/owner/${id}`);
        const data = await res.json();

        if (res.ok) {
          setPlant(data);

          // ✅ Initialize order with 0 quantity for available items (or all items if needed)
          const availableItems = Object.keys(ITEM_PRICES).filter(
            (item) => data.stock?.[item]
          );

          const initialOrder = {};
          availableItems.forEach((item) => {
            initialOrder[item] = 0;
          });

          setOrder(initialOrder);
        } else {
          setPlant(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setPlant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleQtyChange = (key, type) => {
    setOrder((prev) => ({
      ...prev,
      [key]: type === "inc" ? prev[key] + 1 : Math.max(prev[key] - 1, 0),
    }));
  };

  const totalAmount = Object.entries(order).reduce((total, [key, qty]) => {
    return total + qty * (ITEM_PRICES[key] || 0);
  }, 0);

  const handleBuyNow = () => {
  const hasItems = Object.values(order).some((qty) => qty > 0);

  if (!hasItems) {
    alert("Please select at least one item to order.");
    return;
  }

  navigate("/payment", {
    state: {
      order,
      plant,
      totalAmount,
    },
  });

  };

  if (loading)
    return (
      <div className="text-center text-lg text-gray-500 mt-10">Loading...</div>
    );

  if (!plant)
    return (
      <div className="text-center text-red-600 mt-10">
        Water Plant not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-1">
     <Navbar/>
      <img
        src={plant.shopImage || "/placeholder.png"}
        alt={plant.shopName}
        onError={(e) => (e.target.src = "/placeholder.png")}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />

      <h1 className="text-2xl font-bold text-blue-700">{plant.shopName}</h1>
      <div className="text-gray-600 flex items-center mt-1">
        <FaMapMarkerAlt className="mr-2 text-blue-500" />
        {plant.address}
      </div>
      <div className="flex items-center text-sm mt-1 text-gray-600">
        <FaUser className="mr-1" />
        Owner: {plant.ownerName}
      </div>
      <div className="flex items-center text-sm text-yellow-500 mt-1">
        <FaStar className="mr-1" />
        4.5 (Ratings placeholder)
      </div>

      {/* Render only stock items that are in order */}
      <div className="mt-6">
        {Object.entries(order).map(([item, qty]) => (
          <div
            key={item}
            className="flex justify-between items-center border p-3 rounded-lg mb-3"
          >
            <div>
              <div className="capitalize text-gray-800 font-medium">
                {item.replace(/([A-Z])/g, " $1")}
              </div>
              <div className="text-sm text-gray-500">
                ₹{ITEM_PRICES[item] || 0} each
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQtyChange(item, "dec")}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                <FaMinus />
              </button>
              <span className="text-lg font-semibold">{qty}</span>
              <button
                onClick={() => handleQtyChange(item, "inc")}
                className="bg-blue-500 px-2 py-1 text-white rounded hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-4 text-lg font-semibold text-blue-700">
        Total: ₹{totalAmount}
      </div>

      <button
        onClick={handleBuyNow}
        className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Buy Now
      </button>
    </div>
  );
};

export default BuyNowPage;
