import React from 'react';
import assets from '../assets/assets';

const SavedProducts = ({ onProductClick }) => {
  // Sample saved products data - replace with actual saved products from backend
  const savedProducts = [
    {
      id: 1,
      name: 'Calculus Textbook',
      price: '₱500',
      category: 'Academic Books',
      seller: 'John Doe',
      imageList: [assets.blank_image1_icon || 'https://via.placeholder.com/300x300?text=Product+1'],
      comments: [] // Add comments array for ProductPost component
    },
    {
      id: 2,
      name: 'Scientific Calculator',
      price: '₱300',
      category: 'School Supplies',
      seller: 'Jane Smith',
      imageList: [assets.blank_image1_icon || 'https://via.placeholder.com/300x300?text=Product+2'],
      comments: []
    }
  ];

  if (savedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-[#FFF7DA] rounded-lg border-2 border-[#A31800]">
        <img className='w-20 h-20 mb-4'   src={assets.warning_icon} alt="No saved items" />
        <h3 className="text-red-900 font-bold text-xl mb-2">No Saved Items</h3>
        <p className="text-red-900 text-sm">You haven't saved any products yet.</p>
        <p className="text-red-900 text-sm">Click the bookmark icon on products to save them here!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2">
      {savedProducts.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="flex flex-col bg-[#FFF7D7]  rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-100 border-1 border-[#FFF7D7]  hover:border-[#A31800] my-2"
        >
          {/* Product Image */}
          <div className="relative w-full h-48 bg-gray-200">
            <img
              src={product.imageList[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-[#A31800] text-white px-2 py-1 rounded-full text-xs font-semibold">
              Saved
            </div>
          </div>

          {/* Product Details */}
          <div className="p-3 flex flex-col flex-grow">
            <h3 className="text-black font-bold text-sm mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-[#A31800] font-extrabold text-lg mb-2">
              {product.price}
            </p>
            <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
              <p className="font-semibold">
                <span className="text-gray-500">Category:</span> {product.category}
              </p>
              <p className="font-semibold">
                <span className="text-gray-500">Seller:</span> {product.seller}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedProducts;