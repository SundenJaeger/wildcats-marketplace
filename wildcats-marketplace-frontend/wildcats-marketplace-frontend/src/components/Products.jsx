import React from 'react'
import assets from "../assets/assets";
import PhotoCard from "./PhotoCard";

const Products = ({isMarketplaceView}) => {

  const productList = [
    { id: 1, name: "Product 1", price: "$10.00", image: assets.blank_image_icon },
    { id: 2, name: "Product 2", price: "$20.00", image: assets.blank_image_icon },
    { id: 3, name: "Product 3", price: "$30.00", image: assets.blank_image_icon },
    { id: 4, name: "Product 4", price: "$40.00", image: assets.blank_image_icon },
  ];
  
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2'>
      {productList.map((product) => (
        <PhotoCard 
          key={product.id}
          image={product.image}
          name={product.name}
          price={product.price}
        />
      ))}
      
    </div>
  );
};

export default Products
