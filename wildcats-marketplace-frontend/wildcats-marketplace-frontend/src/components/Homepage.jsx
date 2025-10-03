import React from 'react'
import assets from '../assets/assets'
import Products from './Products'
import SellerDashboard from './SellerDashboard';
import ProductPost from './ProductPost'; // ADD THIS IMPORT!

const Homepage = () => {

    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);
    
    const [selectedProduct, setSelectedProduct] = React.useState(null)

    return (
    <div className="flex flex-col justify-top h-screen flex-1 max-w-[750px] min-w-[300px] mx-2">

        {/* Fix the conditional rendering (you had the ternary backwards) */}
        {!selectedProduct ? (
            <>
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

                {/* Marketplace */}
                {isMarketplaceView && (
                    <>
                        <div>
                            <img src={assets.homepage_welcome_banner} 
                                alt="Wildcats" 
                                className="w-full h-full object-contain rounded-lg" 
                            />
                        </div>
                        
                        <br></br>
                        
                        <div>
                            <div className='flex justify-between items-center mx-1'>
                                <h3 className='text-black font-bold text-xl '>
                                    Today's Picks
                                </h3>
                                <img className='w-5 h-5'src={assets.filter_icon}></img>
                            </div>

                            {/* Pass setSelectedProduct to Products */}
                            <Products onProductClick={setSelectedProduct}/>
                        </div>
                    </>
                )}

                {/* Seller Dashboard */}
                {!(isMarketplaceView) && (
                    <>
                        <div className='flex flex-col justify-top h-screen w-full'>
                            <SellerDashboard/>
                        </div>
                    </>
                )}
            </>
        ) : (
            <ProductPost product={selectedProduct} onBack={() => setSelectedProduct(null)}/>
        )}
    </div>
    )
}

export default Homepage