import assets from "../assets/assets"
import React, {useEffect} from "react"



const VerificationModel = ({username, onClose}) => {

    //  ·useEffect(() => {
    //     const duration = 3000;

    //     const timerId = setTimeout(() => {
    //         onClose();
    //     }, duration);

    //     return () => {
    //         clearTimeout(timerId);
    //     };
    // }, [onClose])

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/50 z-50 backdrop-blur-sm'>
            <div className='flex flex-col bg-gradient-to-br from-[#FFF4CB] to-[#FFE99F] border-2 rounded-2xl shadow-2xl w-130 overflow-hidden animate-fade-in'> 
                
                {/* Header with close button */}
                <div className='flex w-full justify-between items-center px-6 py-3'>
                    <div className='flex items-center justify-center gap-2'>
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">
                            Welcome, {username}!
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='flex justify-center items-center w-5 h-5 bg-gradient-to-br from-[#B20000] to-[#8B0000] rounded-full hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg'
                    >
                        <img className="w-3 h-3" src={assets.white_close_icon} alt="close" />
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-col justify-center items-start px-8 py-6 bg-white/60 backdrop-blur-sm">
                    
                    <p className='text-md text-gray-700 leading-relaxed'>
                        You've been successfully verified as a <span className='font-semibold text-[#8B0000]'>CIT-U student</span>. 
                        <br />
                        Start exploring the Wildcat's Marketplace now! 🎉
                    </p>
                </div>
            </div>
        </div>
        )
}

export default VerificationModel