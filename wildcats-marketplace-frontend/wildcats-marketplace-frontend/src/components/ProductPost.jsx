import React from 'react'

const ProductPost = ({ product, onBack }) => {
  return (
    <div className="p-4">
      <button 
        onClick={onBack}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        â† Back
      </button>
      
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full max-w-md mt-4"/>
      <p className="text-xl mt-4">{product.price}</p>
      {/* Add more product details as needed */}
    </div>
  )
}

export default ProductPost