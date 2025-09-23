import React from 'react'
import assets from '../assets/assets'

const Splashscreen = () => {
  return (
    <img
          src={assets.splash_screen}
          alt="Splash"
          className="w-1000 h-full object-contain rounded-lg"
        />
  )
}

export default Splashscreen
