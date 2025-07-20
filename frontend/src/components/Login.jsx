import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { X, CheckCircle, XCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar2 from "./Navbar2";

const Login = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is still valid
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          navigate("/");
        } else {
          // Token expired
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      }
    }
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, password } = form;

    console.log("Login data:", form);

    try {
      const response = await fetch(
        `http://localhost:5000/api/login?phone=${encodeURIComponent(
          name
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        setMessage("Login successful!");
        setMessageType("success");
        navigate("/");

        console.log("User:", data.user);
      } else {
        setMessage(data.message || "Login failed");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar2 />

      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          {/* Message Box - moved inside the card above logo */}
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

              {/* Close Button */}
              <button
                onClick={() => setMessage("")}
                className="text-gray-400 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5 mt-0.5" />
              </button>
            </div>
          )}

          {/* Logo */}
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

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Login
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Phone"
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
