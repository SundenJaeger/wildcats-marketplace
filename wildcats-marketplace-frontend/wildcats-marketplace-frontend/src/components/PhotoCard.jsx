const PhotoCard = ({ image, name, price, onClick }) => {
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling to parent div
    onClick(); // Trigger the onClick function
  };

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
        onClick={handleButtonClick}
        className="absolute bottom-3 right-2 bg-[#a50000] text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-[#c50000] focus:outline-none"
      >
        See Details
      </button>
    </div>
  );
};

export default PhotoCard; // FIXED: Was "ProductPost"