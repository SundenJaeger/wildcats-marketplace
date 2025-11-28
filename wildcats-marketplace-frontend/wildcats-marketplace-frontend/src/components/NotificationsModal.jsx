import React from 'react'
import assets from '../assets/assets'

const NotificationsModal = ({onClose}) => {
  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
      <div className='flex flex-col justify-between bg-[#fff1bd] rounded-md p-4 w-190 h-auto border-2 border-[#726948] gap-2 pl-5'>

        <div className='flex justify-between items-start'>
            <div className='flex flex-col mt-5 mb-2'>
                <h2 className='text-black font-bold text-2xl'>My Notifications</h2>
            </div>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>


        {/* Main Body */}
        <div className='flex justify-around items-start pb-5 h-100 gap-3'>


          {/* Idk what we should put here so its just a placeholder fn */}
          <div className='bg-[#FFFAE4] flex flex-col items-center justify-center w-full h-full'>
            <img className='w-20 h-20 rounded-xl m-2' src={assets.empty_space_icon}>
            </img>
            <p className='text-black font-semibold p-1'>Poof! It's empty...</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NotificationsModal
