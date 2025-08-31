import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, CalendarDays } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");

  useEffect(() => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);

    const fetchUser = async () => {
      try {
        const storedPhone = localStorage.getItem("phone");
        const res = await fetch(
          `http://localhost:5173/api/customers/${storedPhone}`
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setName(data.name);
        setPhone(data.phone);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:5173/api/users/${user.phone}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("phone", updatedUser.phone); // update local storage if phone is changed
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Failed to update profile.");
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="flex justify-center items-center py-12 px-4">
        {user ? (
          <div className="w-full max-w-4xl bg-white shadow-xl border border-blue-100 rounded-3xl overflow-hidden grid md:grid-cols-3">
            {/* Left Panel: Avatar */}
            <div className=" p-8 flex flex-col items-center justify-center">
              <img
                className="w-32 h-32 rounded-full shadow-md"
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`}
                alt="Profile Avatar"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Right Panel: Details */}
            <div className="col-span-2 p-8">
              <h3 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-2">
                Profile Details
              </h3>

              {message && (
                <div className="mb-4 text-sm text-green-600 font-medium">
                  {message}
                </div>
              )}

              <div className="space-y-5">
                {/* Name Field */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2">
                    Name:
                  </label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{user.name}</span>
                  )}
                </div>

                {/* Phone Field */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <Phone size={16} /> Phone:
                  </label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{user.phone}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <Mail size={16} /> Email:
                  </label>
                  <span className="text-gray-800 pt-2">{user.email}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <MapPin size={16} /> Address:
                  </label>
                  <span className="text-gray-800 pt-2">{user.address}</span>
                </div>

                {/* Update Dates */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <CalendarDays size={16} /> Joined:
                  </label>
                  <span className="text-gray-800 pt-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <CalendarDays size={16} /> Updated:
                  </label>
                  <span className="text-gray-800 pt-2">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex gap-4">
                {editMode ? (
                  <>
                    <button
                      className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
                      onClick={() => {
                        setEditMode(false);
                        setName(user.name);
                        setPhone(user.phone);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Loading profile...
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
