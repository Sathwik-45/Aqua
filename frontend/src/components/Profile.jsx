import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Mail, Phone, MapPin, CalendarDays } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const phone = localStorage.getItem("phone");
        const res = await fetch(`http://localhost:5000/api/customers/${phone}`);

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white">
      <Navbar />
      <div className="flex justify-center items-center py-12 px-4">
        {user ? (
          <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left: Profile Pic */}
            <div className="bg-blue-500 w-full md:w-1/3 flex flex-col items-center justify-center p-6 text-white">
              <img
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt="Profile"
              />
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-sm">Customer Profile</p>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-2/3 p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Profile Details</h3>
              <div className="space-y-3 text-gray-700 text-base">
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-blue-500" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={20} className="text-blue-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-blue-500" />
                  <span>
                    <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-blue-500" />
                  <span>
                    <strong>Last Update:</strong> {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
