import React from "react";
import AdCarousel from "./Adimages";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Intro = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Hero Section - Takes up part of the screen */}
      <div className="flex-none bg-gradient-to-b from-blue-100 to-white flex items-center justify-center py-6 md:py-10 px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 leading-tight tracking-tight">
              Welcome to <br /><span className="text-blue-500">PureDrop</span>
            </h1>
            <p className="text-gray-700 text-lg md:text-xl font-medium max-w-2xl">
              Delivering pure, refreshing water directly to your doorstep.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
          {/* Right Image/Space Placeholder if needed */}
        </div>
      </div>

      {/* Ad Carousel Section - Takes up the remaining space */}
      <div className="flex-1 min-h-0">
        <AdCarousel />
      </div>
    </div>
  );
};

export default Intro;
