import React from 'react'

const Signup = () => {
  return (
    <div className='min-w-full h-full bg-[#FFF7D4] rounded-md'>
      <div className='flex flex-col items-center justify-center gap-2 p-3'>
        <h2 className='text-4xl font-bold text-black my-5'>LOGIN</h2>

        <div className='w-full flex items-center justify-center mt-10'>
          <input 
            type="text" 
            placeholder='Username/Student-ID' 
            className='w-[90%] p-3 rounded-md mb-4 bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent'
          />
        </div>

        <div className='w-full flex items-center justify-center'>
          <input 
            type="password" 
            placeholder='Password' 
            className='w-[90%] p-3 rounded-md mb-0.5 bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent'
          />
        </div>

        <div className='w-full flex items-center justify-center'>
          <input 
            type="password" 
            placeholder='Confirm Password' 
            className='w-[90%] p-3 rounded-md mb-0.5 bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent'
          />
        </div>

        <div className='w-full flex items-center justify-center mb-4'>
          <p className='text-black text-sm'>Already have an account?</p>
          <a href="/register" className='text-[#A31800] font-medium hover:underline'> Sign in</a>
        </div>
        
        <button className='w-1/2 mb-4 bg-[#A31800] text-white p-2 rounded-md hover:bg-[#7A0E00] transition duration-300 font-medium'>
          Login
        </button>
      </div>
    </div>
  )
}

export default Signup