import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // Add login logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content: Adjust height to be full minus navbar (assumed h-16 = 4rem) */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
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
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your name"
              />
            </div>

            <div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Show Password
              </label>
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
