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
          <div className='flex'>
            <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10" />
                <h2 className='text-lg font-extrabold font-serif text-white'>Wildcat's Marketplace</h2>
          </div>

          <div className='flex flex-col'>
            <div className='flex items-end'>
              <img className='w-4 h-4' src={assets.white_settings_icon}></img>
              <img className='w-4 h-4' src={assets.white_notification_icon}></img>
              <img className='w-4 h-4' src={assets.white_profile_icon}></img>
              <p>username</p>
            </div>

            <div className='flex bg-white p-1 rounded-md h-5'>
              <input className='flex justify-en'>
              </input>
              <img className='w-4 h-4' src={assets.red_search_icon}></img>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Navbar
