import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'

const ProductPost = ({ product, onBack }) => {

  const placeholder_comment = [{name: "StrongKat", profile: assets.blank_profile_icon, comment: "Hello, is this available?"}]

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
    <>
      {/* Go Back */}
        <div className='flex justify-end items-center'>
          <div onClick={onBack  }
              className='flex justify-center items-center w-8 h-8 m-1 opacity-85 hover:scale-110 bg-[#B20000] rounded-full'>
              <input type="image" className="w-3  h-3" src={assets.white_close_icon}></input>
          </div>
        </div>
      <div className="flex flex-col p-3 px-3 bg-[#FFF7D7] h-150">

        <div className='flex justify-between h-[100%] b-2'>
          {/* Product Images or Left Side */}
          <div className='flex flex-col justify-center w-1/2 h-[90h] m-2 box-content'
            >
              <div className='w-full h-full flex justify-between items-center bg-cover bg-center rounded-lg'
              style={{backgroundImage:`url(${product.imageList[productImageIndex]})`}}>
                <div className='flex justify-between w-full'>
                  <div className='flex justify-start items-center m-1'>
                    <input type="image" onClick={decIndex} className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70' src={assets.previous_button_icon}></input>
                  </div>

                  <div className='flex justify-start items-center m-1'>
                    <input type="image" onClick={incIndex} className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70' src={assets.next_button_icon}></input>
                  </div>
                </div>
              </div>

            
          </div>

          {/*Product Details or Right Side*/}
          <div className='flex flex-col py-3 h-auto w-1/2 p-3'>
            <div className='flex items-start justify-between'>
              {/* Name, Price, Date Listed */}
              <div className='flex flex-col justify-start mb-2 gap-2'>
                <h2 className="text-4xl text-black font-extrabold">{product.name}</h2>
                <h3 className="text-2xl text-black leading-2 font-semibold">{product.price}</h3>
                <h3 className='text-xs leading-7 text-[#5B5B5B] font-semibold'>Listed by Michael - 22-4444-123</h3>
              </div>

              {/*  Buttons  */}
              <div className='flex justify-between items-center gap-1'>
              <div onClick={handleSave} className='flex justify-center items-center p-1  rounded-lg'>
                <input type="image" className="w-5 h-5" src={isPostSaved ? assets.save_icon : assets.save_icon_saved}></input>
                </div>
                <div onClick={() => setShowReportModal(true)} className='flex justify-center items-center p-1 rounded-lg'>
                  <input type="image" className="w-5 h-5" src={assets.report_icon}></input>
                </div>
              </div>
            </div>


            {/* Line Break */}
            <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 my-2'></div>

            <div className='mb-2 py-3'>
            {/* Product Details */}
            <div className='grid grid-cols-[100px_1fr] mb-2 gap-2'>
              <p className='text-[#5B5B5B] text-md font-bold'>Category</p>
              <p className='text-[#999999] text-sm font-bold'>Academic Books and Notes</p>
              <p className='text-[#5B5B5B] text-md font-bold'>Condition</p>
              <p className='text-[#999999] text-sm font-bold'>New</p>
            </div>

              <p className='text-[#999999] text-sm font-semibold leading-6'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat cupiditate aspernatur autem officia perspiciatis unde aliquid in doloribus, libero voluptate, vitae consequuntur, necessitatibus adipisci nesciunt facilis quos similique fuga aperiam.</p>
            </div>

            {/* Thread */}
            <div className='flex flex-col justify-start items-start'>
              <div className='flex gap-1 mb-1 mt-3'>
                <img className="w-4.5 h-4.5" src={assets.comment_icon}></img>
                <p className='text-[#999999] text-xs font-semibold leading-tight'>1</p>
              </div>
            </div>


            {/* Line Break */}
            <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 mt-1 mb-2'></div>

            <div className='py-3 flex flex-col justify-between flex-grow'>
              <div className='flex items-start gap-1.5'>
                <img className='w-10 h-10 rounded-full p-2 bg-gray-100 border-1 border-gray-200' src={placeholder_comment[0].profile}></img>
                <div className='flex flex-col bg-[#fffcf2] w-full rounded-xl p-2.5'>
                  <p className='text-gray-700 font-bold text-sm'>{placeholder_comment[0].name}</p>
                  <p className='text-gray-500 font-semibold text-sm'>{placeholder_comment[0].comment}</p>
                </div>
              </div>

              <div className='flex justify-center items-center mt-8'>
                <div className='p-1 rounded-md border-gray-400'>
                  <img className='w-11 h-10 rounded-full p-2 bg-gray-100 border-1 border-gray-200' src={assets.blank_profile_icon}></img>
                </div>
                <div className='flex px-2 items-center justify-between bg-[#fffcf2] w-full h-12 rounded-xl border-2 border-gray-200 '>
                  <input type='text' className='w-full focus:outline-none text-black placeholder-gray-400 text-xs font-semibold' placeholder='Comment as John Doe'></input>
                  <div className='p-1 rounded-md border-gray-400'>
                    <img className='w-3 h-3 opacity-50' src={assets.enter_icon}></img>
                  </div>
                </div>
              </div>
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
    </>
  )
}

export default ProductPost