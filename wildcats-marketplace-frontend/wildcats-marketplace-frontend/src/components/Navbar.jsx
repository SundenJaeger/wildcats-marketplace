import React from 'react'
import assets from '../assets/assets'
import {useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isHomepage = location.pathname === '/home';

  return (
    <div className='absolute top-0 left-0 w-full h-14 z-10 bg-[#A31800]'>
      {/* Navbar for LoginSignup Page */}
      {!isHomepage && (
          <div>
            <div className='flex items-center gap-2 p-2 justify-center'>
                <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10" />
                <h2 className='text-lg font-extrabold font-serif text-white'>Wildcat's Marketplace</h2>
            </div>
          </div>
      )}

      {/* Navbar for Homepage */}
      {isHomepage && (
        <div className='flex items-center gap-2 p-2 px-40 justify-between'>
          <div className='flex items-center gap-1'>
            <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10" />
                <h2 className='text-lg font-extrabold font-serif text-white'>Wildcat's Marketplace</h2>
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center justify-end mb-1'>
              <img className='w-4 h-4 mx-1' src={assets.white_settings_icon}></img>
              <img className='w-4 h-4 mx-1' src={assets.white_notification_icon}></img>
              <img className='w-4 h-4 mx-1' src={assets.white_profile_icon}></img>
              <p className='text-xs pb-0.5'>username</p>
            </div>

            <div className="relative flex items-center justify-end duration-150 focus-within:scale-[1.025] bg-white p-1 rounded-md h-5 w-50.6">
              <input
                className="peer outline-0 w-full caret-transparent bg-transparent"
                type="text"
              />

              <span className="absolute left-2 text-gray-400 text-xs opacity-0 peer-focus:opacity-100 transition-opacity duration-150">
                Search here...
              </span>

              <img
                className="duration-150 w-3.5 h-3.5"
                src={assets.red_search_icon}
                alt="Search Icon"
              />
            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default Navbar
