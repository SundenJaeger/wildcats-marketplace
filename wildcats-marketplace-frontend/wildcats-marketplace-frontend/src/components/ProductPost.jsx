import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'

const ProductPost = ({ product, onBack }) => {

  const placeholder_comment = [{name: "StrongKat", profile: assets.blank_profile_icon, comment: "Hey man I like tomboys spam W chat W W W"}]

  const [isPostSaved, setPostSaved] = React.useState(false)

  const [productImageIndex, setProductImageIndex] = React.useState(0)

  const [showReportModal, setShowReportModal] = React.useState(false)

  function decIndex(){
    setProductImageIndex( prev => prev<=0 ? 0 : prev - 1);
    console.log("decreased" + productImageIndex)
  }

  function incIndex(){
    setProductImageIndex(prev => prev >= product.imageList.length-1 ? product.imageList.length-1 : prev + 1);
    console.log("increased" + productImageIndex)
  }

  function handleSave(){
    setPostSaved(!isPostSaved)
  }

  const handleReportSubmit = (ReportData) => {
    alert('Report submitted successfully')
    setShowReportModal(false)
  }

  return (
    <div className="flex flex-col p-4 px-6 bg-[#FFF7D7]">

      {/* Go Back */}
        <div className='flex justify-end items-center'>
            <div onClick={onBack  }
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
                </div>
        </div>

      <div className='flex justify-between gap-4 mb-2'>
        {/* Product Images */}
        <div className='flex justify-between w-[100%] h-[500px] mt-4 rounded-md bg-cover bg-center'
          style={{backgroundImage:`url(${product.imageList[productImageIndex]})`}}>

          <div className='flex justify-start items-center m-1'>
            <input type="image" onClick={decIndex} className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70' src={assets.previous_button_icon}></input>
          </div>

          <div className='flex justify-start items-center m-1'>
            <input type="image" onClick={incIndex} className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70' src={assets.next_button_icon}></input>
          </div>
        </div>

        {/* Name, Price, Date Listed */}
        <div className='flex flex-col py-4'>
          <div className='flex flex-col justify-start mb-4'>
            <h2 className="text-2xl text-black font-bold">{product.name}</h2>
            <h3 className="text-xl text-black font-bold">{product.price}</h3>
            <h3 className='text-black text-sm'>Listed by John Doe - 22-4444-123</h3>
          </div>

          {/*  Buttons  */}
          <div className='flex justify-between items-center gap-2'>
            <button className='bg-[#B20000] hover:bg-[#990000] w-full min-w-35 h-9.5 rounded-lg font-bold'>Message</button>
            <div className='flex justify-center items-center p-3 bg-[#B20000] hover:bg-[#990000] rounded-lg'>
              <input onClick={handleSave} type="image" className="w-3.5 h-3.5" src={isPostSaved ? assets.white_save_icon : assets.white_save_icon_saved}></input>
            </div>
            <div onClick={() => setShowReportModal(true)} className='flex justify-center items-center p-3 bg-[#B20000] hover:bg-[#990000] rounded-lg'>
              <input type="image" className="w-3.5 h-3.5" src={assets.white_report_icon}></input>
            </div>
          </div>

          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-5 mx-1'></div>

          <div className='mb-2'>
          {/* Product Details */}
          <h3 className='text-[#5B5B5B] text-md font-bold'>Details</h3>
            <div className='grid grid-cols-2 mb-2'>
              <p className='text-[#5B5B5B] text-md font-bold'>Condition</p>
              <p className='text-[#999999] text-sm font-bold'>New</p>
            </div>

            <p className='text-[#999999] text-sm font-semibold leading-6'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium perferendis.</p>
          </div>

          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-3 mx-1'></div>

          {/* Thread */}
          <div className='flex flex-col justify-start items-start'>
            <div className='flex ml-2 gap-1 my-1'>
              <img className="w-4.5 h-4.5" src={assets.comment_icon}></img>
              <p className='text-[#999999] text-sm font-semibold leading-tight'>1</p>
            </div>

            <div className='flex px-2 items-center justify-between bg-white w-full h-8 rounded-md border-2 border-gray-200'>
              <input type='text' className='w-full text-black placeholder-gray-400 text-xs font-semibold' placeholder='Write a message'></input>
              <div className='p-1 rounded-md bg-gray-200 border-1 border-gray-400'>
                <img className='w-2 h-2' src={assets.enter_icon}></img>
              </div>
            </div>
          </div>


          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-3 mx-1'></div>

          <div>
            <div className='flex items-center gap-2'>
              <img className='w-6 h-6' src={placeholder_comment[0].profile}></img>
              <div className='flex flex-col'>
                <p className='text-black font-bold text-xs'>{placeholder_comment[0].name}</p>
                <p className='text-gray-400 font-semibold text-xs'>{placeholder_comment[0].comment}</p>
              </div>
            </div>
            <button className='text-gray-500 text-xs ml-8 font-bold'>Reply</button>
          </div>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          product={product}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  )
}

export default ProductPost