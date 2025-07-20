import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaUser,
  FaStar,
  FaPlus,
  FaMinus,
  FaTint,
  FaBoxOpen,
} from "react-icons/fa";

const BuyNowPage = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tins, setTins] = useState(0);
  const [packs, setPacks] = useState(0);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/owners`);
        const data = await response.json();

        const selectedPlant = data.find((item) => String(item._id) === id);
        setPlant(selectedPlant);
      } catch (error) {
        console.error("Error fetching plant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleBuyNow = () => {
    alert(
      `✅ Order Placed!\n\n🧊 ${tins} Water Tin(s)\n🧴 ${packs} Bottle Pack(s)\n\n📍 From: ${plant.shopName}`
    );
  };

  const handleChange = (setter, value) => {
    setter((prev) => Math.max(0, prev + value));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!plant)
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Water Plant not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      {/* Image */}
      <img
        src={plant.shopPhoto || "/placeholder.png"}
        alt={plant.shopName}
        className="w-full h-64 object-cover rounded-xl mb-4"
        onError={(e) => (e.target.src = "/placeholder.png")}
      />

      {/* Shop Details */}
      <h1 className="text-3xl font-bold text-blue-700 mb-1">{plant.shopName}</h1>
      <p className="text-gray-700 flex items-center gap-2">
        <FaUser className="text-blue-400" /> {plant.ownerName}
      </p>
      <p className="text-gray-700 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-400" /> {plant.address},{" "}
        {plant.location}
      </p>
      <p className="text-yellow-500 flex items-center gap-1 mt-1">
        <FaStar /> {plant.rating || "No rating"}
      </p>

      {/* Order Section */}
      <div className="mt-6 space-y-6">
        {/* Water Tins */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
            <FaTint className="text-blue-600" />
            Water Tins (20L)
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChange(setTins, -1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
            >
              <FaMinus />
            </button>
            <span className="text-xl font-semibold">{tins}</span>
            <button
              onClick={() => handleChange(setTins, 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Bottle Packs */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
            <FaBoxOpen className="text-green-600" />
            Bottle Packs (1L x 12)
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChange(setPacks, -1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
            >
              <FaMinus />
            </button>
            <span className="text-xl font-semibold">{packs}</span>
            <button
              onClick={() => handleChange(setPacks, 1)}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-300"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;
