import React from 'react'
import assets from '../assets/assets'
import Products from './Products'

const Homepage = () => {

    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);

    return (
    <div className="flex flex-col justify-top h-screen">

        <div className='flex justify-between space-x-4'>
            <button 
                className={`w-1/2 mb-2 pb-[0.5%] font-bold text-xl bg-transparent text-black focus:outline-none
                ${isMarketplaceView ? 'border-b-4 border-black' : 'border-none'}`}
                onClick={() => setIsMarketplaceView(true)}>
                Marketplace
            </button>
            <button 
                className={`w-1/2 mb-2 pb-[0.5%] font-bold text-xl bg-transparent text-black focus:outline-none
                ${!isMarketplaceView ? 'border-b-4 border-black' : 'border-none'}`}
                onClick={() => setIsMarketplaceView(false)}>
                Seller Dashboard
            </button>
        </div>
        <div>
            <img src={assets.homepage_welcome_banner} 
                alt="Wildcats" 
                className="w-200 h-full object-contain rounded-lg" 
            />
        </div>

        
        <br></br>
        
        <div>
            {/* Today's Picks and Filtering Options */}
            <div className='flex justify-between items-center mx-1'>
                <h3 className='text-black font-bold text-xl '>
                    Today's Picks
                </h3>
                <img className='w-5 h-5'src={assets.filter_icon}></img>
            </div>

        <Products isMarketplaceView={isMarketplaceView}/>
        </div>
    </div>
    )
}

export default Homepage