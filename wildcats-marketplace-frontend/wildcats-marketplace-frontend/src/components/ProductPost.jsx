import React from 'react'
import assets from '../assets/assets'

const ProductPost = ({ product, onBack }) => {

  const [isPostSaved, setPostSaved] = React.useState(false)

  const [productImageIndex, setProductImageIndex] = React.useState(0)

  function decIndex(){
    setProductImageIndex( prev => prev<=0 ? 0 : prev - 1);
    console.log("decreased" + productImageIndex)
  }

  function incIndex(){
    setProductImageIndex(prev => prev >= product.imageList.length-1 ? product.imageList.length-1 : prev + 1);
    console.log("increased" + productImageIndex)
  }

  return (
    <div className="flex flex-col p-4 px-6 bg-[#FFF7D7]">

      {/* Go Back */}
      <div className='flex justify-end items-center'>
        <div onClick={onBack}
            className='flex justify-center items-center w-8 h-8 bg-[#B20000] rounded-full'>
              <input type="image" className="w-3.5 h-3.5" src={assets.white_close_icon}></input>
            </div>
      </div>
      
      <div className='flex justify-between gap-4 mb-2'>
        {/* Product Images */}
        <div className='flex justify-between w-[160%] h-[435px] mt-4 rounded-md bg-cover bg-center'
          style={{backgroundImage:`url(${product.imageList[productImageIndex]})`}}>

          <div className='flex justify-start items-center m-1'>
            <input type="image" onClick={decIndex} className='w-8 h-8' src={assets.previous_button_icon}></input>
          </div>

          <div className='flex justify-start items-center m-1'>
            <input type="image" onClick={incIndex} className='w-8 h-8' src={assets.next_button_icon}></input>
          </div>
        </div>
        
        {/* Name, Price, Date Listed */}
        <div className='flex flex-col py-4'>
          <div className='flex flex-col justify-start mb-4'>
            <h2 className="text-2xl text-black font-bold">{product.name}</h2>
            <h3 className="text-xl text-black font-bold">{product.price}</h3>
            <h3 className='text-black text-sm'>Listed hours ago</h3>
          </div>

          {/*  Buttons  */}
          <div className='flex justify-between items-center gap-2'>
            <button className='bg-[#B20000] w-full min-w-35 h-9.5 rounded-lg font-bold '>Message</button>
            <div className='flex justify-center items-center p-3 bg-[#B20000] rounded-lg'>
              <input type="image" className="w-3.5 h-3.5" src={isPostSaved ? assets.white_save_icon : assets.white_save_icon_saved}></input>
            </div>
            <div className='flex justify-center items-center p-3 bg-[#B20000] rounded-lg'>
              <input type="image" className="w-3.5 h-3.5" src={assets.white_report_icon}></input>
            </div>
          </div>
          
          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-5 mx-1'></div>

          <div>
          {/* Product Details */}
          <h3 className='text-[#5B5B5B] text-lg font-bold'>Details</h3>
            <div className='grid grid-cols-2 mb-2'>
              <p className='text-[#5B5B5B] text-lg font-bold'>Condition</p>
              <p className='text-[#999999] text-lg font-bold'>New</p>
            </div>

            <p className='text-[#999999] text-lg font-semibold leading-6'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium perferendis.</p>
          </div>

          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-5 mx-1'></div>
          
          {/* Seller Info */}
          <h3 className='text-[#5B5B5B] text-lg font-bold'>Seller Information</h3>
          <div className='flex justify-start items-center mt-2'>
            <img className='w-8 h-8' src={assets.blank_profile_icon}></img>
            <div className='flex flex-col ml-2 '>
              <p className='text-[#5B5B5B] text-md font-bold leading-3.5'>John Doe</p>
              <p className='text-[#999999] text-sm font-semibold leading-tight'>22-4444-123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPost