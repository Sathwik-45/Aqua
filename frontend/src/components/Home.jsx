import React from "react";
import Navbar from "./Navbar";
import AdCarousel from "./Adimages";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
{/* bg-gradient-to-b from-blue-100 via-white to-blue-50  */}
      {/* Hero Section */}
      <div className="p-10 bg-gradient-to-b from-blue-100 via-white to-white-50 flex items-center justify-center  px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
              Welcome to <span className="text-blue-500">PureDrop</span>
            </h1>
            <p className="text-gray-700 text-lg">
              Delivering pure, refreshing water to your doorstep. 
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Right Image */}
         
        </div>
      </div>

      {/* Ad Carousel Section */}
      <div className=" bg-white px-4">
        {/* <h2 className="text-3xl font-bold text-center text-blue-700 mb-3">
          Explore Our Services
        </h2> */}
        <AdCarousel />
      </div>
    </div>
  );
};

export default Home;
