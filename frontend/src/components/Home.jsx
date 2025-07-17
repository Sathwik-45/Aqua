import React from "react";
import Navbar from "./Navbar";
import AdCarousel from "./Adimages";
const Home = () => {
  return (
    <div>
           <Navbar />

      {/* PureDrop Logo Image */}
      {/* The image is centered and responsive, with rounded corners and shadow for aesthetic appeal. */}
      {/* A placeholder is provided in case the image fails to load. */}
      

      {/* AdCarousel component */}
      <AdCarousel />
    </div>
  );
};

export default Home;
