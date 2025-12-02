import React from 'react'
import assets from "../assets/assets";
import PhotoCard from "./PhotoCard";

const Products = ({onProductClick}) => {
  const productList = [
    { 
      id: 1, 
      name: "Product 1", 
      price: "$10.00", 
      category: "Academic Books",
      seller: "John Doe",
      imageList: [assets.blank_image1_icon, assets.blank_image2_icon, assets.blank_image3_icon] 
    },
    { 
      id: 2, 
      name: "Product 2", 
      price: "$20.00", 
      category: "School Supplies",
      seller: "Jane Smith",
      imageList: [assets.blank_image1_icon, assets.blank_image2_icon, assets.blank_image3_icon] 
    },
    { 
      id: 3, 
      name: "Product 3", 
      price: "$30.00", 
      category: "Electronics",
      seller: "Mike Johnson",
      imageList: [assets.blank_image1_icon, assets.blank_image2_icon, assets.blank_image3_icon] 
    },
    { 
      id: 4, 
      name: "Product 4", 
      price: "$40.00", 
      category: "Dorm Essentials",
      seller: "Sarah Lee",
      imageList: [assets.blank_image1_icon, assets.blank_image2_icon, assets.blank_image3_icon] 
    }
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2'>
      {productList.map((product) => (
        <PhotoCard
          key={product.id}
          image={product.imageList[0]}
          name={product.name}
          price={product.price}
          category={product.category}
          seller={product.seller}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

export default Products