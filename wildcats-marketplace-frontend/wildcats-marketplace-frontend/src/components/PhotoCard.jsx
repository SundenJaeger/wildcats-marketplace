const PhotoCard = ({ image, name, price, category, seller, onClick }) => {
  const handleCardClick = () => {
    onClick();
  };
  
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col bg-[#FFF7D7] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-100 border-1 border-[#FFF7D7] hover:border-[#A31800] my-2"
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-black font-bold text-sm mb-1 line-clamp-2">
          {name}
        </h3>
        <p className="text-[#A31800] font-extrabold text-lg mb-2">
          {price}
        </p>
        <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
          <p className="font-semibold">
            <span className="text-gray-500">Category:</span> {category}
          </p>
          <p className="font-semibold">
            <span className="text-gray-500">Seller:</span> {seller}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;