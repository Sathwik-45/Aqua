import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000" // Your local API endpoint
  : "https://aqua-tml9.onrender.com";


const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, {
        animate: true,
        duration: 2,
      });
    }
  }, [position, map]);
  return null;
};

const Change_loc = () => {
  const l = useLocation();
  const navigate = useNavigate();
  const { lat, lon } = l.state || {};

  const initialPos = lat && lon ? [lat, lon] : [17.385044, 78.486671];
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState(initialPos);

  const handleSearch = async () => {
    const response = await fetch(`${API_BASE}/geocode?q=${location}`);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setPosition(newPos);

      const timer = setTimeout(() => {
        navigate("/Home", {
          state: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          },
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Search Bar */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">
          🌍 Change Your Location
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="🔍 Enter city or state"
            className="flex-1 border border-gray-300 p-2 rounded-md outline-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Map with Border and Margin */}
      <div className="flex-grow">
        <div className=" overflow-hidden shadow-lg border border-gray-300">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-[75vh] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            <MapUpdater position={position} />
          </MapContainer>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="mt-4 text-center bg-white rounded-xl p-3 shadow text-sm font-medium">
        📍 <strong>Latitude:</strong> {position[0].toFixed(5)} &nbsp;|&nbsp;
        <strong>Longitude:</strong> {position[1].toFixed(5)}
      </div>
    </div>
  );
};

export default Change_loc;
