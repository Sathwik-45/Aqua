import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaStar,
  FaLocationArrow,
  FaUser,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const [allWaterPlants, setAllWaterPlants] = useState([]);
  const [filteredWaterPlants, setFilteredWaterPlants] = useState([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch shop data from backend
 const fetchWaterPlantsFromBackend = useCallback(async () => {
  setIsLoadingPlants(true);
  try {
    const response = await fetch("http://localhost:5000/api/owners");
    const data = await response.json();
    console.log("API Response:", data);


      const formattedData = data.map((owner, index) => ({
        _id:owner._id,
        src: owner.shopImage,
        alt: owner.shopName,
        title: owner.shopName,
        description: owner.description || "No description available",
        ownerName: owner.ownerName,
        address: owner.address,
        city: owner.location.city,
        state: owner.location.state,
        latitude: owner.location.latitude,
        longitude: owner.location.longitude,
        rating: owner.rating || 4.0,
      }));
      setAllWaterPlants(formattedData);
      setFilteredWaterPlants(formattedData);
    } catch (error) {
      console.error("Error fetching from backend:", error);
    }
    setIsLoadingPlants(false);
  }, []);

  useEffect(() => {
    fetchWaterPlantsFromBackend();
  }, [fetchWaterPlantsFromBackend]);

  // Handle search filtering
  useEffect(() => {
    const filtered = allWaterPlants.filter((plant) =>
      (plant.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.state || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.ownerName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWaterPlants(filtered);
  }, [searchQuery, allWaterPlants]);

  return (
    <div className="bg-blue-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search water plants by name, city, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute top-3 left-3 text-blue-400" />
        </div>

        {/* Loading State or No Results */}
        {isLoadingPlants ? (
          <div className="text-center py-10">
            <span className="text-blue-500 font-semibold">
              Loading water plants...
            </span>
          </div>
        ) : filteredWaterPlants.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No results found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWaterPlants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={plant.src}
                  alt={plant.alt || "Shop Image"}
                  className="rounded-xl h-40 object-cover mb-3"
                   onClick={() => navigate(`/buynow/${plant._id}`)} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
                <h2 className="text-xl font-bold text-blue-700">{plant.title}</h2>
                <p className="text-sm text-gray-600">{plant.description}</p>
                <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  {plant.ownerName}
                </div>
                <div className="text-sm text-blue-600 flex items-center gap-2">
                  <FaLocationArrow className="text-blue-400" />
                  {plant.address}, {plant.city}, {plant.state}
                </div>
                <div className="mt-auto pt-2 text-yellow-500 flex items-center gap-1">
                  <FaStar /> {plant.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
