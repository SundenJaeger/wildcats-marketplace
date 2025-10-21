import React from 'react'
import assets from '../assets/assets'

const SellerDashboard = () => {
    return (
    <div className='flex flex-col justify-top h-screen w-full'>
    <br></br>
      {/* Overview */}
        <div className='mb-4'>
            <h2 className="text-xl text-black font-bold mb-2">Overview</h2>
            <div className='bg-[#FFF7DA] border-[#9E7D00] p-4 rounded-lg shadow-md flex space-x-4 px-10'>
                <div className='flex flex-col justify-center items-start w-1/2 border-1 rounded-md border-[#787878] bg-[#FFFCEE] p-2 px-4'>
                    <div className='flex w-full h-full'>
                        <h2 className="text-2xl text-black font-bold mb-4">
                            0
                        </h2>
                    </div>
                    <h3 className="text-xs text-black font-bold mb-4">
                        Chats to answer
                    </h3>
                </div>

                <div className='flex flex-col justify-center items-start w-1/2 border-1 rounded-md border-[#787878] bg-[#FFFCEE] p-2 px-4'>
                    <div className='flex w-full h-full '>
                        <h2 className="text-2xl text-black font-bold mb-4">
                            0
                        </h2>
                        <img
                        className='w-4.5 h-4.5 mt-2 ml-1'
                        src={assets.star_icon}></img>
                    </div>
                    <h3 className="text-xs text-black font-bold mb-4">
                        Seller Ratings
                    </h3>
                </div>
            </div>
        </div>

        <br className='h-3'></br>
        {/* Your Listings */}
        <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
                <h2 className="text-xl text-black font-bold">Your Listings</h2>
                <button className='bg-[#8B0000] rounded-md text-[10px] p-2 px-4 font-bold'>+ Create new Listing</button>
            </div>
            <div className='bg-[#FFF7DA] border-[#9E7D00] p-4 rounded-lg shadow-md flex space-x-4 px-10'>
                <div className='flex flex-col justify-center items-start w-1/2 border-1 rounded-md border-[#787878] bg-[#FFFCEE] p-2 px-4'>
                    <div className='flex w-full h-full'>
                        <h2 className="text-2xl text-black font-bold mb-4">
                            0
                        </h2>
                    </div>
                    <h3 className="text-xs text-black font-bold mb-4">
                        Active & pending
                    </h3>
                </div>

                <div className='flex flex-col justify-center items-start w-1/2 border-1 rounded-md border-[#787878] bg-[#FFFCEE] p-2 px-4'>
                    <div className='flex w-full h-full'>
                        <h2 className="text-2xl text-black font-bold mb-4">
                            0
                        </h2>
                    </div>
                    <h3 className="text-xs text-black font-bold mb-4">
                        Drafts
                    </h3>
                </div>

                <div className='flex flex-col justify-center items-start w-1/2 border-1 rounded-md border-[#787878] bg-[#FFFCEE] p-2 px-4'>
                    <div className='flex w-full h-full '>
                        <h2 className="text-2xl text-black font-bold mb-4">
                            0
                        </h2>
                    </div>
                    <h3 className="text-xs text-black font-bold mb-4">
                        Sold
                    </h3>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SellerDashboard
