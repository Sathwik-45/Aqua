import React, { useEffect, useState } from "react";

const AdCarousel = () => {
  const images = ["/gay.png", "/girl.png", "/boy.png", "/people.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden py-2 px-2 md:py-4 md:px-4">
      {/* Image container with responsive size */}
      <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl flex-1 overflow-hidden rounded-xl shadow-lg bg-gray-50 border border-blue-50">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`Ad ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2 mt-2 md:mt-4">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
