// components/PhotoCard.jsx
import React from "react";

const PhotoCard = ({ image, name, price }) => {
  return (
    <div
      className="bg-[#FFF9E0] w-full h-65 rounded-md shadow-md relative 
                 hover:shadow-md hover:scale-101 transition-transform duration-100 cursor-pointer"
    >
      {/* Product image */}
      <img
        src={image}
        alt="Product"
        className="w-full h-[65%] object-cover rounded-md"
      />

      {/* Product details */}
      <h2 className="font-bold text-black mt-0 pt-1 px-2">{name}</h2>
      <p className="font-bold text-black text-sm px-2">{price}</p>

      {/* Button */}
      <button
        className="absolute bottom-3 right-2 bg-[#a50000] text-white text-xs px-4 py-1.5 rounded-md hover:bg-[#c50000] focus:outline-none"
      >
        See Details
      </button>
    </div>
  );
};

export default PhotoCard;
