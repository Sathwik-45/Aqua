import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registered data:", formData);
    // Add registration logic here
  };

  return (
       <div>
<Navbar/>   
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
          Register
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Phone", type: "tel", name: "phone" },
            { label: "Email", type: "email", name: "email" },
            { label: "Address", type: "text", name: "address" },
            { label: "Password", type: "password", name: "password" },
            { label: "Confirm Password", type: "password", name: "confirmPassword" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already registered?{" "}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div></div>
  );
};

export default Register;
