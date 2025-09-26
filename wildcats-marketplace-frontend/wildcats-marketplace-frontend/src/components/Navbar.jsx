import React from 'react'
import assets from '../assets/assets'

const Navbar = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-14 z-10 bg-[#A31800]'>
      <div>
        <div className='flex items-center gap-2 p-2 justify-center'>
            <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10" />
            <h2 className='text-lg font-extrabold font-serif text-white'>Wildcat's Marketplace</h2>
        </div>
      </div>
    </div>
  )
}

export default Navbar
