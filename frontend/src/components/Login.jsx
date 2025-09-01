import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X, CheckCircle, XCircle } from "lucide-react";

// ✅ Dynamically set the API base URL based on the hostname.
// This allows the app to work on both localhost and your Render domain.
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000" // Your local API endpoint
  : "https://aqua-tml9.onrender.com"; // ✅ Replace with your actual Render URL

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  // The token check on load has been removed to fix the compilation error.
  // A check to navigate away should be added here once the jwt-decode issue is resolved.

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phone, password } = form;

    // Reset messages before a new submission
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      // ✅ IMPORTANT: Check if the response is successful (status 200-299)
      // before trying to parse the JSON. This fixes the SyntaxError.
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData.message = `Login failed. Server responded with status ${response.status}.`;
        }
        setMessage(errorData.message || "Login failed.");
        setMessageType("error");
        return;
      }

      const data = await response.json();
      console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("phone", form.phone || "");
      localStorage.setItem("userName", data.user.name);

      setMessage("Login successful!");
      setMessageType("success");

      window.dispatchEvent(new Event("storage"));
      navigate("/Home");
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Something went wrong. Please check your network connection.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          {message && (
            <div
              className={`mb-4 w-full rounded-lg p-3 px-4 text-sm flex items-start justify-between gap-2 shadow-sm transition-all duration-300 ${
                messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-start gap-2 flex-1">
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <p>{message}</p>
              </div>
              <button
                onClick={() => setMessage("")}
                className="text-gray-400 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5 mt-0.5" />
              </button>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <img
              src="/water.jpg"
              alt="PureDrop Logo"
              className="w-52 h-auto rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/300x150/ADD8E6/000000?text=PureDrop+Logo";
              }}
            />
          </div>

          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter 10-digit phone"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Not registered?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
