import React from "react";
import AdCarousel from "./Adimages";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Intro = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Hero Section - Takes up part of the screen */}
      <div className="flex-none bg-gradient-to-b from-blue-100 to-white flex items-center justify-center py-12 md:py-20 px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-8xl font-black text-blue-700 leading-tight tracking-tight">
              Welcome to <br /><span className="text-blue-500 drop-shadow-sm">PureDrop</span>
            </h1>
            <p className="text-gray-700 text-xl md:text-3xl font-medium max-w-2xl">
              Delivering pure, refreshing water <br className="hidden md:block" /> directly to your doorstep.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-xl md:text-2xl"
              >
                Get Started Now
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
