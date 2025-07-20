import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar2 from "./Navbar2";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Phone validation function (only digits, exactly 10 numbers)
  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Phone validation check
    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid 10-digit phone number (digits only).");
      return;
    }

    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Registered data:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div>
      <Navbar2 />
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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
