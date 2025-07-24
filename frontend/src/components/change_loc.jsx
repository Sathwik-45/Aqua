import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, {
        animate: true,
        duration: 2, // seconds
      });
    }
  }, [position, map]);

  return null;
};

const Change_loc = () => {
  const l = useLocation();
  const navigate = useNavigate();

  const { lat, lon } = l.state || {};

  // Default to Hyderabad if no location is passed
  const initialPos = lat && lon ? [lat, lon] : [17.385044, 78.486671];

  const [location, setLocation] = useState(""); // city/state input
  const [position, setPosition] = useState(initialPos);

  // 🔍 Search location by city/state
  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setPosition(newPos);

      // ✅ Redirect to Home with new coordinates
      const timer = setTimeout(() => {
        navigate("/Home", {
          state: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          },
        });
      }, 4000); // ⏳ 4 seconds delay

      return () => clearTimeout(timer); // 🧹 Clean up on unmount
    }
  };

  // 🖱 Click to set marker
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Change Location</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city or state"
          className="border p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <MapUpdater position={position} />
      </MapContainer>

      <div className="mt-4">
        <strong>Latitude:</strong> {position[0]} <br />
        <strong>Longitude:</strong> {position[1]}
      </div>
    </div>
  );
};

export default Change_loc;
