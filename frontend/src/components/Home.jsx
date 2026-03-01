import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { FaSearch, FaStar, FaLocationArrow, FaUser } from "react-icons/fa";
import { MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE from "../apiConfig";
const HomePage = () => {
  const location = useLocation();
  const redirectedLat = location.state?.lat;
  const redirectedLon = location.state?.lon;

  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [allWaterPlants, setAllWaterPlants] = useState([]);
  const [filteredWaterPlants, setFilteredWaterPlants] = useState([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState("Detecting location...");

  // ✅ Correct useEffect for geolocation
  useEffect(() => {
    const fetchUserLocation = async (lat, lon) => {
      try {
        const response = await fetch(
          `${API_BASE}/reverse-geocode?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) throw new Error("Failed to fetch address");
        const data = await response.json();

        if (data && data.address) {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            "Unknown Location";
          const state = data.address.state || "";
          setUserLocation(`${city}${state ? `, ${state}` : ""}`);
        } else if (data && data.display_name) {
          setUserLocation(data.display_name.split(',')[0]);
        } else {
          setUserLocation("Location found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setUserLocation("Location unavailable");
      }
    };

    if (redirectedLat && redirectedLon) {
      // ✅ Use redirected coordinates from Change_loc
      setCoordinates({ lat: redirectedLat, lon: redirectedLon });
      fetchUserLocation(redirectedLat, redirectedLon);
    } else if (navigator.geolocation) {
      // ✅ Fallback to browser location
      setUserLocation("Requesting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
          fetchUserLocation(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Location access denied");
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
    }
  }, [redirectedLat, redirectedLon]);

  // ✅ fetch shop data (no hooks inside)
  const fetchWaterPlantsFromBackend = useCallback(async () => {
    setIsLoadingPlants(true);
    try {
      const url = (coordinates.lat && coordinates.lon)
        ? `${API_BASE}/api/owners?lat=${coordinates.lat}&lon=${coordinates.lon}`
        : `${API_BASE}/api/owners`;

      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data);
      const formattedData = data.map((owner) => ({
        _id: owner._id,
        src: owner.shopImage,
        alt: owner.shopName,
        title: owner.shopName,
        description: owner.description || "No description available",
        ownerName: owner.ownerName,
        address: owner.address,
        city: owner.location || "Unknown",
        state: owner.state || "",
        rating: owner.rating || 4.0,
      }));

      setAllWaterPlants(formattedData);
      setFilteredWaterPlants(formattedData);
    } catch (error) {
      console.error("Error fetching from backend:", error);
    }
    setIsLoadingPlants(false);
  }, [coordinates]);

  useEffect(() => {
    fetchWaterPlantsFromBackend();
  }, [fetchWaterPlantsFromBackend]);

  // Search filter
  useEffect(() => {
    const filtered = allWaterPlants.filter(
      (plant) =>
        (plant.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.state || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.ownerName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredWaterPlants(filtered);
  }, [searchQuery, allWaterPlants]);

  return (
    <div className="bg-blue-50 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="pt-4 pb-2">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search water plants by name, city, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-blue-400" />
          </div>

          {/* Location + Change Location Button */}
          <div className="mt-3 mb-1 text-sm text-gray-700 flex items-center justify-between bg-white/50 p-2 rounded-lg">
            <div className="flex items-center gap-1 overflow-hidden">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="font-semibold truncate">{userLocation}</span>
            </div>
            <button
              className="text-blue-600 font-medium hover:text-blue-800 shrink-0 ml-2"
              onClick={() =>
                navigate("/change-location", {
                  state: {
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                  },
                })
              }
            >
              Change Location
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
          {/* Loading State or No Results */}
          {isLoadingPlants ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-blue-500 font-semibold text-lg">
                {(coordinates.lat && coordinates.lon) ? "Finding nearby water plants..." : "Fetching all registered water plants..."}
              </p>
            </div>
          ) : filteredWaterPlants.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-blue-100 mt-4">
              <p className="text-gray-500 text-lg">No water plants found.</p>
              <p className="text-gray-400 text-sm mt-1">Try searching for a different city or shop name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredWaterPlants.map((plant) => (
                <div
                  key={plant._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col group cursor-pointer border border-transparent hover:border-blue-200"
                  onClick={() => navigate(`/buynow/${plant._id}`)}
                >
                  <div className="relative overflow-hidden rounded-xl h-40 mb-3 bg-gray-100">
                    <img
                      src={plant.src}
                      alt={plant.alt || "Shop Image"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
                    {plant.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-3">{plant.description}</p>

                  <div className="space-y-1.5 mt-auto">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <FaUser className="text-blue-400 w-3.5 h-3.5" />
                      <span className="truncate">{plant.ownerName}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <FaLocationArrow className="text-blue-400 w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{plant.address}, {plant.city}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-orange-500 flex items-center gap-1 font-bold">
                      <FaStar className="w-4 h-4" /> {plant.rating.toFixed(1)}
                    </div>
                    <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
