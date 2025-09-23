import React from 'react'

const Login = () => {
  return (
    <div className='w-full h-full bg-[#FFF7D4] rounded-md'>
      <div className='flex flex-col items-center justify-center gap-2 p-3'>
        <h2 className='text-2xl font-bold text-black my-5'>Login</h2>

        <div className='w-full'>
          <label className='text-black'>
            Username/Student-ID
          </label>
          <input 
            type="text" 
            placeholder='ex 23-1432-165' 
            className='w-full p-2 rounded-md mb-4 border border-gray-300 focus:border-gray-500 focus:outline-none'
          />
        </div>

        <div className='w-full'>
          <label className='text-black'>
            Password
          </label>
          <input 
            type="password" 
            placeholder='' 
            className='w-full p-2 rounded-md mb-4 border border-gray-300 focus:border-gray-500 focus:outline-none'
          />
        </div>
        
        <button className='w-1/3 bg-[#A31800] text-white p-2 rounded-md hover:bg-[#7A0E00] transition duration-300'>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login