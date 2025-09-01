import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
// ❌ Remove React Toastify imports
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// ✅ Import Sonner components and functions
import { Toaster, toast } from 'sonner';

// Dynamically set the API base URL based on the hostname.
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://aqua-tml9.onrender.com"; // Replace with your actual Render URL

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phone, password } = form;

    // ✅ Sonner automatically handles clearing previous toasts
    // No need to manually call toast.dismiss()

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // ✅ Use Sonner's toast.error
        toast.error(errorData.message || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("phone", data.user.phone);
      localStorage.setItem("userName", data.user.name);

      // ✅ Use Sonner's toast.success
      toast.success(data.message);

      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
        navigate("/Home");
      }, 500);
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Network error. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* ✅ Replace ToastContainer with Toaster from Sonner */}
     

      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
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