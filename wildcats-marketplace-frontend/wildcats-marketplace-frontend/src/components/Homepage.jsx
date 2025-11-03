import React from 'react'
import assets from '../assets/assets'
import Products from './Products'
import SellerDashboard from './SellerDashboard';
import ProductPost from './ProductPost'; 
import SettingsModal from './SettingsModal';
import NotificationsModal from './NotificationsModal';
import ProfileModal from './ProfileModal';
import Navbar from './Navbar';
import ProductFilterModal from './ProductFilterModal'

const Homepage = () => {

    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);

    const [selectedProduct, setSelectedProduct] = React.useState(null);

    const [showSettings, setShowSettings] = React.useState(false);

    const [showNotifications, setShowNotifications] = React.useState(false);

    const [showProfile, setShowProfile] = React.useState(false);

    const [showProductFilter, setShowProductFilter] = React.useState(false);

    return (
    <div className="flex flex-col justify-top h-screen flex-1 max-w-[1000px] min-w-[300px] mx-2">

        <Navbar
            onSettingsClick={() => {
                console.log("Settings clicked in Homepage!");
                setShowSettings(true);
            }}
            onNotificationsClick={() => {
                console.log("Notifications clicked in Homepage!");
                setShowNotifications(true);
            }}
            onProfileClick={() => {
                console.log("Profile clicked in Homepage!");
                console.log("showProfile before:", showProfile);
                setShowProfile(true);
                console.log("showProfile after setState called");
            }}
            />

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
                                className="w-full h-full object-contain rounded-lg mt-0.5" 
                            />
                        </div>

                        <br></br>

                        <div>
                            <div className='flex justify-between items-center mx-1'>
                                <h3 className='text-black font-bold text-xl '>
                                    Today's Picks
                                </h3>
                                <button
                                type="button"
                                className=""
                                onClick={() => setShowProductFilter(!showProductFilter)}>
                                <img className="w-5 h-5" src={assets.filter_icon} alt="filter" />
                                </button>
                            </div>

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

        {console.log("Render check - showProfile:", showProfile)}

        {showSettings && (<SettingsModal onClose={() => setShowSettings(false)} />)}
        {showNotifications && (<NotificationsModal onClose={() => setShowNotifications(false)} />)}
        {showProfile && (<ProfileModal onClose={() => setShowProfile(false)} />)}
        {showProductFilter && (<ProductFilterModal onClose={() => setShowProductFilter(false)}/>)}


    </div>
    )
}

export default Homepage