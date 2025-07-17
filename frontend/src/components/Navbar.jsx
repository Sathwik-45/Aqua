import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between relative z-50">
      {/* Left: Hamburger menu (mobile) */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Center: Title */}
      {/* <div className="text-xl font-bold text-blue-600  md:static md:translate-x-0">
        AquaWheels
      </div> */}

      {/* Right: Login (mobile) */}
      <div className="md:hidden">
        <button className="text-blue-600 font-medium hover:underline">
          Login
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium ml-auto">
        <li className="hover:text-blue-600 cursor-pointer">Home</li>
        <li className="hover:text-blue-600 cursor-pointer">My Orders</li>
        <li className="hover:text-red-500 cursor-pointer">Logout</li>
      </ul>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 md:hidden">
          <ul className="flex flex-col space-y-4 p-4 text-gray-700 font-medium">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">My Orders</li>
            <li className="hover:text-red-500 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
