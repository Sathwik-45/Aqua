import React, { useState } from "react";
import { Link } from "react-router-dom"; 

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4"
      >
        <img
          src="/your-logo.png"
          alt="Logo"
          className="mx-auto w-24 h-24 object-contain"
        />

        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Login
        </h2>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
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
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
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
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600">
          Not registered?{" "}
          <Link
            to="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
