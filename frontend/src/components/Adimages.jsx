import React, { useEffect, useState } from "react";

const AdCarousel = () => {
  const images = ["/boy.jpg", "/girl.jpg", "/boy.jpg", "/girl.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full flex flex-col items-center overflow-hidden py-6">
      {/* Sliding Image Track */}
      <div className="w-[600px] h-[550px] overflow-hidden rounded-lg shadow-md">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Ad ${index + 1}`}
              className="w-[600px] h-[550px]  object-center flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2 mt-4">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-blue-600 scale-110" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
