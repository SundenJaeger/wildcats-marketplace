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
import VerificationModel from './VerificationModal';
import { useLocation } from 'react-router-dom';

const Homepage = () => {

    const location = useLocation();

    const { isNewUser, username } = location.state || {};

    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);

    const [selectedProduct, setSelectedProduct] = React.useState(null);

    const [showSettings, setShowSettings] = React.useState(false);

    const [showNotifications, setShowNotifications] = React.useState(false);

    const [showProfile, setShowProfile] = React.useState(false);

    const [isAdmin, setIsAdmin] = React.useState(false)

    const [showProductFilter, setShowProductFilter] = React.useState(false);

    const [showVerificationModal, setShowVerificationModal] = React .useState(isNewUser);

    return (
    <div className="flex flex-col justify-top h-screen flex-1 max-w-[1000px] min-w-[300px] mx-2">

        <Navbar
            onAdminClick={() => {
                console.log("Admin clicked in Homepage!");
                setIsAdmin(true);
            }}
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

        {isAdmin ? (
            <>
                <div className='p-2 w-full h-full flex flex-col gap-4'>
                    <div className='flex justify-end'>
                        <button className='p-2 text-xs font-bold rounded-full bg-red-800' onClick={() => setIsAdmin(false)}>Go Back</button>
                    </div>

                    <div>
                        <div>
                            <h1>
                                Reports Dashboard
                            </h1>
                            <h3>
                                Monitor and manage resource Reports
                            </h3>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <div className='flex justify-between bg-red-600 p-3 py-6 w-60 rounded-md'>
                            <div className='flex flex-col'>
                                <h6>
                                    Total Reports
                                </h6>
                                <h4>
                                    0
                                </h4>
                            </div>
                            <img className='w-5 h-5' src={assets.total_reports_icon}></img>
                        </div>

                        <div className= 'flex justify-between bg-orange-600 p-3 py-6 w-60 rounded-md'>
                            <div className='flex flex-col'>
                                <h6>
                                    Total Reports
                                </h6>
                                <h4>
                                    0
                                </h4>
                            </div>
                            <img className='w-5 h-5' src={assets.clock_icon}></img>
                        </div>

                        <div className='flex justify-between bg-blue-600 p-3 py-6 w-60 rounded-md'>
                            <div className='flex flex-col'>
                                <h6>
                                    Total Reports
                                </h6>
                                <h4>
                                    0
                                </h4>
                            </div>
                            <img className='w-5 h-5' src={assets.clock_icon}></img>
                        </div>

                        <div className='flex justify-between bg-green-600 p-3 py-6 w-60 rounded-md'>
                            <div className='flex flex-col'>
                                <h6>
                                    Total Reports
                                </h6>
                                <h4>
                                    0
                                </h4>
                            </div>
                            <img className='w-5 h-5' src={assets.check_icon}></img>
                        </div>
                    </div>

                    <div className='p-3 border-1 border-amber-500 flex flex-col bg-white'>
                        <div className='flex items-center'>
                            <img className='w-3 h-3' src={assets.filter_icon}></img>
                            <h4 className='text-amber-950'>Filter Reports</h4>
                        </div>

                        <div className='flex'>
                            <button className='p-2 text border-1 border-amber-950 bg-amber-200 rounded-xl text-amber-950 text-sm hover:'>All Reports</button>
                            <button className='p-2 text border-1 border-amber-950 bg-amber-200 rounded-xl text-amber-950 text-sm hover:'>Pending</button>
                            <button className='p-2 text border-1 border-amber-950 bg-amber-200 rounded-xl text-amber-950 text-sm hover:'>Under Review</button>
                            <button className='p-2 text border-1 border-amber-950 bg-amber-200 rounded-xl text-amber-950 text-sm hover:'>Resolved</button>
                            <button className='p-2 text border-1 border-amber-950 bg-amber-200 rounded-xl text-amber-950 text-sm hover:'>Rejected</button>
                        </div>
                    </div>

                    <div>
                        <div className='flex justify-between items-center py-2'>
                            <h2 className='text-amber-950 text-xl font-bold'>All Reports</h2>
                            <h6 className='text-amber-950 text-xs font-bold'>reports</h6>
                        </div>

                        <div className='w-full h-100 bg-amber-50 flex flex-col justify-center items-center rounded-lg'>
                            <div className='w-full flex flex-col justify-center items-center'>
                                <img className='w-15 h-15' src={assets.warning_icon}></img>
                                <h3 className='text-amber-950 font-bold'>No reports found</h3>
                                <p className='text-amber-800'>There are no reports in the systems yet.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        ) : ( 
            <>
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
            </>
        )}

        {/* {!selectedProduct ? (
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

                {/* Marketplace *
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

                {/* Seller Dashboard 
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
        )} */}

        {console.log("Render check - showProfile:", showProfile)}

        {showSettings && (<SettingsModal onClose={() => setShowSettings(false)} />)}
        {showNotifications && (<NotificationsModal onClose={() => setShowNotifications(false)} />)}
        {showProfile && (<ProfileModal onClose={() => setShowProfile(false)} />)}
        {showProductFilter && (<ProductFilterModal onClose={() => setShowProductFilter(false)}/>)}

        {showVerificationModal && (
        <VerificationModel
            username={username}
            onClose={() => setShowVerificationModal(false)}
        />
        )}
    </div>
    )
}

export default Homepage