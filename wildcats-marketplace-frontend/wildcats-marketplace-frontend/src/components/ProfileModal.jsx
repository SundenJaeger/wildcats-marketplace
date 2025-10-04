import React from 'react'
import assets from '../assets/assets'

const ProfileModal = ({onClose}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div>
        <div>
            <h2>My Profile</h2>
            <p>Manage and protect your account</p>
        </div>

        <div onClick={onClose}
            className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
            <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
        </div>
      </div>

      {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-1'></div>

    </div>
  )
}

export default ProfileModal
