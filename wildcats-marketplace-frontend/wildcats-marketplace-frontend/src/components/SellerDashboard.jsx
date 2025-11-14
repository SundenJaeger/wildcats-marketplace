import React from 'react'
import assets from '../assets/assets'
import CreateListingModal from './CreateListingModal'

const SellerDashboard = () => {

    const [isActiveListing, setIsActiveListing] = React.useState(true)

    const [createNewListing, setCreateNewListing] = React.useState(false)

    return (
    <div className='flex flex-col justify-top h-screen w-full'>
    <br></br>
      {/* Overview */}
        <div className='mb-4'>
            <h2 className="text-xl text-black font-bold mb-2">Your Profile</h2>
            <div className='bg-[#FFF7DA] border-[#9E7D00] p-4 rounded-lg shadow-md  space-x-4 px-5'>
                <div className='bg-[#FFFCEE] flex'>
                    <div className='flex flex-col justify-center items-start p-2 px-4'>
                        <img src={assets.blank_profile_icon} className='w-40'></img>
                    </div>

                    <div className='flex flex-col justify-center items-start w-full rounded-md p-2 px-4'>
                        <div className='flex w-full mb-1'>
                            <h2 className="text-2xl text-black font-bold mr-1">
                                John Doe 
                            </h2>
                            <h2 className='text-gray-500 text-2xl font-bold'>(johndoe)</h2>
                        </div>
                        <h3 className="text-xs text-black font-bold mb-1">
                            22-4444-123
                        </h3>
                        <h3 className="text-xs text-black font-bold mb-1">
                            john.doe@cit.edu
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <br className='h-3'></br>
        {/* Your Listings */}
        <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
                <h2 className="text-xl text-black font-bold">Your Listings</h2>
                <button 
                    onClick={setCreateNewListing}
                    className='bg-[#8B0000] rounded-md text-[10px] p-2 px-4 font-bold hover:scale-102'>+ Create new Listing
                </button>
            </div>
            <div className='bg-[#FFF7DA] border-[#9E7D00] p-4 rounded-lg shadow-md flex space-x-4 px-5 min-h-[50vh]'>
                <button
                    onClick={() => setIsActiveListing(true)}
                    className={`w-1/2 rounded-md h-10 shadow-xs
                    ${!isActiveListing ? 'bg-gray-400 border-2 border-gray-400 text-gray-100' : 'bg-[#FFFCEE] border-2 border-gray-400 text-black'}`}>
                    Active
                </button>
                <button
                    onClick={() => setIsActiveListing(false)}
                    className={`w-1/2 rounded-md h-10 shadow-xs
                    ${isActiveListing ? 'bg-gray-400 border-2 border-gray-400 text-gray-100' : 'bg-[#FFFCEE] border-2 border-gray-400 text-black'}`}>
                    Draft
                </button>
            </div>

        </div>

        {createNewListing && (
            <CreateListingModal
                onClose={() => setCreateNewListing(false)}>
            </CreateListingModal>
        )}
    </div>
    )
}

export default SellerDashboard
