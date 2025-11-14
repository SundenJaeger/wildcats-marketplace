import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'

const CreateListingModal = ({ onClose }) => {


  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
        <div className="flex flex-col p-2 px-3 bg-[#FFF7D7] h-[700px] w-200 rounded-lg">

          <div className='flex justify-between pl-3 mb-2 items-center'>
              <div className='flex justify-between items-center mt-3'>
                  <h2 className='text-black font-bold text-xl'>Create Listing</h2>
              </div>
              <div onClick={onClose}
                  className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                  <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
              </div>
          </div>

        <div className='flex flex-col'>
          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Title
            </label>
            <div className='bg-white rounded-md'>
              <textarea className='w-full text-black p-2 resize-none' rows={1} required wrap='hard' type='text' placeholder='Enter here...'>
              </textarea>
            </div>
          </div>

          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Description
            </label>
            <div className='bg-white rounded-md'>
              <textarea className='w-full text-black p-2 resize-none' rows={3} required wrap='hard' type='text' placeholder='Enter here...'>
              </textarea>
            </div>
          </div>

          
        </div>

      </div>
    </div>

  )
}

export default CreateListingModal