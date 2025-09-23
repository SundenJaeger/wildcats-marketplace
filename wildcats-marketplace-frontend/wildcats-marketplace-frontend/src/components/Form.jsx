import React from 'react'
import Splashscreen from './Splashscreen'
import Login from './Login'

const FormLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-[#5E0E00] rounded-lg shadow-lg mb-50">
        {/* Splashscreen */}
        <div className="w-full md:w-[60%] p-6">
          <Splashscreen />
        </div>

        {/* Form */}
        <div className="w-full md:w-[40%] p-6">
          <Login />
        </div>
      </div>
    </div>
  )
}

export default FormLayout