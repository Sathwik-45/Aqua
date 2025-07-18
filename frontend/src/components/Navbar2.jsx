import React, { useState } from "react";
import { Menu, ChevronUp, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogin = () => navigate("/login");
  const goHome = () => navigate("/");

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between relative z-50">
      {/* Left: Hamburger menu + Logo (Mobile) */}
      <div className="md:hidden flex items-center space-x-3">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-700 transition-transform duration-300 rotate-180" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
        <div className="font-inter text-2xl font-semibold flex items-center">
          <span className="text-blue-800">Pure</span>
          <span className="text-blue-400">Drop</span>
        </div>
      </div>

      {/* Right: Home Button (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={goHome}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Home className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium ml-auto">
        <li className="hover:text-blue-600 cursor-pointer">Home</li>
        <li className="hover:text-blue-600 cursor-pointer">My Orders</li>
        <li className="hover:text-red-500 cursor-pointer">Logout</li>
      </ul>

      {/* Mobile Dropdown Menu with Smooth Transition */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md z-40 md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col space-y-4 p-4 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">My Orders</li>
          <li className="hover:text-red-500 cursor-pointer">Logout</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar2;
