import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const PhotoCard = ({ image, name, price, category, seller, status, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-[#fffbe9] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-100 border-2 border-red-900 hover:border-[#A31800] my-2"
    >
      {/* Product Image */}
      <div className="relative flex items-center justify-center w-full h-48 bg-gray-200 border-b-2 border-red-900">
        {!imageError && image ? (
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <Camera className="w-12 h-12 text-gray-400" />
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-3 grow">
        <h3 className="mb-1 text-sm font-bold text-black line-clamp-2">
          {name}
        </h3>
        <p className="text-[#A31800] font-extrabold text-lg mb-2">
          {price}
        </p>
        <div className="flex flex-col gap-1 mb-2 text-xs text-gray-600">
          <p className="font-semibold">
            <span className="text-gray-500">Category:</span> {category}
          </p>
          <p className="font-semibold">
            <span className="text-gray-500">{status ? 'Status:' : 'Seller:'}</span> {status || seller}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;