import React, { useEffect, useState } from "react";

const AdCarousel = () => {
  const images = ["/gay.png", "/girl.png", "/boy.png", "/girl.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full flex flex-col items-center overflow-hidden py-8 px-4 ">
      {/* Image container with responsive size */}
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Ad ${index + 1}`}
              className="w-full object-cover flex-shrink-0"
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
