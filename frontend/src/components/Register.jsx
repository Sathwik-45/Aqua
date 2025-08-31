import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
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

  // ✅ Notification state
  const [message, setMessage] = useState(null); // { text: "", type: "success" | "error" }

  // ✅ Indian Phone Validation (starts with 6-9, exactly 10 digits)
  const validateIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 15000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Phone validation check
    if (!validateIndianPhone(formData.phone)) {
      showMessage(
        "Please enter a valid Indian phone number (10 digits, starts with 6-9).",
        "error"
      );
      return;
    }

    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    try {
      const response = await fetch(`${meta}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Registration successful!", "success");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        showMessage(result.message || "Registration failed.", "error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      showMessage("Something went wrong.", "error");
    }
  };

  return (
    <div>
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          {/* ✅ Notification Banner */}
          {message && (
            <div
              className={`flex items-center justify-between px-4 py-2 mb-4 rounded-md shadow-sm border ${
                message.type === "success"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              <span className="text-sm font-medium">{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-3 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
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
