import React from 'react'
import Splashscreen from './Splashscreen'
import LoginSignup from './LoginSignup'

const FormLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row min-w-[500px] max-w-[1000px] bg-[#5E0E00] rounded-lg shadow-lg mb-50">
        {/* Splashscreen */}
        <div className="w-full md:w-[60%] p-6">
          <Splashscreen />
        </div>

        {/* Form */}
        <div className="w-full md:w-[40%] p-6">
          <LoginSignup />
        </div>
      </div>
    </div>
  )
}

export default FormLayout