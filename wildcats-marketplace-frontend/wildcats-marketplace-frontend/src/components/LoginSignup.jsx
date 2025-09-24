import React from 'react'
import assets from '../assets/assets'

const LoginSignup = () => {

  // State for toggling between login and signup modes
  const [isSignupMode, setIsSignupMode] = React.useState(false);

  // Toggle between login and signup
  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
  };

  return (
    <div className='min-w-full h-full bg-[#FFF7D4] rounded-md'>
      <div className='flex flex-col items-center justify-center gap-2 p-3'>
        {/* Dynamic title based on mode */}
        <h2 className='text-4xl font-bold text-black my-5'>
          {isSignupMode ? 'SIGN UP' : 'LOGIN'}
        </h2>

        {/* Username field - always visible */}
        <div className="w-full flex items-center justify-center mt-10 mb-4">
          <div className="relative w-[90%]">
            {/* Icon */}
            <img 
              src={assets.user_icon} 
              alt="user icon" 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            />

            {/* Input */}
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-3 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent"
            />
          </div>
        </div>

        {/* Email field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-4">
            <div className="relative w-[90%]">
              {/* Icon */}
              <img 
                src={assets.email_icon} 
                alt="email icon" 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              />

              {/* Input */}
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Full Name field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-4">
            <div className="relative w-[90%]">
              {/* Icon */}
              <img 
                src={assets.user_icon} 
                alt="user icon" 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              />

              {/* Input */}
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full p-3 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Password field - always visible */}
        <div className="w-full flex items-center justify-center mb-4">
          <div className="relative w-[90%]">
            {/* Icon */}
            <img 
              src={assets.lock_icon} 
              alt="lock icon" 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            />

            {/* Input */}
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 pl-10 pr-12 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent"
            />

            {/* Password visibility icon */}
            <img 
              src={assets.pw_hidden_icon} 
              alt="password visibility icon" 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {/* Confirm Password field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-4">
            <div className="relative w-[90%]">
              {/* Icon */}
              <img 
                src={assets.lock_icon} 
                alt="lock icon" 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              />

              {/* Input */}
              <input 
                type="password" 
                placeholder="Confirm Password" 
                className="w-full p-3 pl-10 pr-12 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent"
              />

              {/* Password visibility icon */}
              <img 
                src={assets.pw_hidden_icon} 
                alt="password visibility icon" 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Mode toggle text */}
      <div className="w-full flex items-center justify-center mb-4">
        <p className="text-black text-sm">
          {isSignupMode ? "Already have an account?" : "Don't have an account?"}
        </p>
        <a
          onClick={toggleMode}
          role="button"
          className="ml-1 text-[#A31800] font-medium hover:underline cursor-pointer"
        >
          {isSignupMode ? " Sign in" : " Sign up"}
        </a>
      </div>

      {/* Submit button with dynamic text */}
      <button className="w-1/2 mb-4 !bg-[#A31800] text-white p-2 rounded-md hover:bg-[#881400] transition duration-300 font-medium">
        {isSignupMode ? "Create Account" : "Login"}
      </button>

      </div>
    </div>
  )
}

export default LoginSignup