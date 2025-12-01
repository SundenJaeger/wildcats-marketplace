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
import { useNavigate } from 'react-router-dom';
import VerificationRequest from './VerificationRequest';

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

    const [adminView, setAdminView] = React.useState('reports'); // 'reports' or 'verification'

    const [selectedFilter, setSelectedFilter] = React.useState('All Reports');

    const filters = ['All Reports', 'Pending', 'Under Review', 'Resolved', 'Rejected'];

    const baseClasses = 'p-2 text-xs font-semibold border-2 rounded-md transition duration-200';

    const inactiveClasses = 'border-[#ffce1f] bg-[#fff3c7] text-amber-950 hover:bg-[#ffe380]';

    const activeClasses = 'border-[#A31800] bg-[#A31800] text-white shadow-md';

    const handleButtonClick = (filter) => {
        setSelectedFilter(filter);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
    setShowSettings(false);
    navigate('/', { state: { hasLoggedOut : true }});
    };

    return (
    <div className="flex flex-col justify-top h-screen flex-1 max-w-[1000px] min-w-[300px] mx-2">

        <Navbar
            isAdmin={isAdmin}
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

                    <div className='flex justify-between'>
                        <div className='flex justify-evenly mb-2 mt-1'>
                            <button
                                className={`w-1/2 border-b-4 pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'reports' ? 'border-red-950' : 'border-transparent'}`}
                                onClick={() => setAdminView('reports')}>
                                Reports
                            </button>
                            <button
                                className={`w-1/2 border-b-4 pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'verification' ? 'border-red-950' : 'border-transparent'}`}
                                onClick={() => setAdminView('verification')}>
                                Verification Requests
                            </button>
                        </div>

                        <div className='flex justify-end h-fit m-2'>
                            <button className='p-2 px-3 text-xs font-bold rounded-lg bg-red-800 text-white' onClick={() => setIsAdmin(false)}>Go Back</button>
                        </div>
                    </div>

                    {/* REPORTS VIEW */}
                    {adminView === 'reports' && (
                        <>
                            <div className='flex justify-between gap-2'>
                                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800'>
                                    <div className='flex flex-col'>
                                        <h6>
                                            Total Reports
                                        </h6>
                                        <h4 className='text-3xl font-bold'>
                                            0
                                        </h4>
                                    </div>
                                    <img className='w-10 h-10' src={assets.total_reports_icon}></img>
                                </div>

                                <div className= 'flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-orange-600 to-amber-700'>
                                    <div className='flex flex-col'>
                                        <h6>
                                            Pending
                                        </h6>
                                        <h4 className='text-3xl font-bold'>
                                            0
                                        </h4>
                                    </div>
                                    <img className='w-8 h-8' src={assets.clock_icon}></img>
                                </div>

                                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-blue-700 to-indigo-800'> 
                                    <div className='flex flex-col'>
                                        <h6>
                                            Under Review
                                        </h6>
                                        <h4 className='text-3xl font-bold'>
                                            0
                                        </h4>
                                    </div>
                                    <img className='w-8 h-8' src={assets.clock_icon}></img>
                                </div>

                                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800'>
                                    <div className='flex flex-col'>
                                        <h6>
                                            Resolved
                                        </h6>
                                        <h4 className='text-3xl font-bold'>
                                            0
                                        </h4>
                                    </div>
                                    <img className='w-8 h-8' src={assets.check_icon}></img>
                                </div>
                            </div>

                            <div className='p-3 px-6 flex flex-col bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800]'>
                                <div className='flex items-center py-3 gap-2'>
                                    <img className='w-4 h-4' src={assets.filter_1_icon}></img>
                                    <h4 className='text-red-900 font-bold'>Filter Reports</h4>
                                </div>

                                <div className='flex gap-1 mb-3'>
                                    {filters.map((filter) => (
                                        <button
                                        key={filter} 
                                        onClick={() => handleButtonClick(filter)}
                                        className={`${baseClasses} ${
                                            selectedFilter === filter ? activeClasses : inactiveClasses
                                        }`}
                                        >
                                        {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className='flex justify-between items-center py-2'>
                                    <h2 className='text-red-900 text-xl font-bold'>All Reports</h2>
                                    <h6 className='text-red-900 text-xs font-bold'> 0 reports</h6>
                                </div>

                                <div className='w-full h-100 bg-[#FFF7DA] flex rounded-md shadow-md border-2 border-[#A31800]'>
                                    <div className='w-full h-full flex flex-col justify-center items-center pb-15 box-border'>
                                        <img className='w-15 h-15' src={assets.warning_icon}></img>
                                        <h3 className='text-red-900 font-bold'>No reports found</h3>
                                        <p className='text-red-900'>There are no reports in the systems yet.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* VERIFICATION REQUESTS VIEW */}
                    {adminView === 'verification' && (
                        <VerificationRequest />
                    )}

                </div>
            </>
        ) : (

            <>
                {!selectedProduct ? (
                <>
                    <div className='flex justify-evenly'>
                        <button
                            className={`w-1/2 mb-2 mt-1 border-b-4 pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                            ${isMarketplaceView ? ' border-red-950' : 'border-transparent'}`}
                            onClick={() => setIsMarketplaceView(true)}>
                            Marketplace
                        </button>
                        <button
                            className={`w-1/2 mb-2 mt-1 border-b-4 pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                            ${!isMarketplaceView ? 'border-red-950' : 'border-transparent'}`}
                            onClick={() => setIsMarketplaceView(false)}>
                            Seller Dashboard
                        </button>
                    </div>

                    {/* Marketplace */}
                    {isMarketplaceView && (
                        <>
                            <div className='mb-5'>
                                <img src={assets.homepage_welcome_banner}
                                    alt="Wildcats"
                                    className="w-full h-full object-contain rounded-lg mt-0.5" 
                                />
                            </div>

                            <br></br>

                            <div>
                                <div className='flex justify-between items-center'>
                                    <h3 className='text-black font-bold text-xl '>
                                        Today's Picks
                                    </h3>
                                    <button
                                    type="button"
                                    className=""
                                    onClick={() => setShowProductFilter(!showProductFilter)}>
                                    <img className="w-5 h-5" src={assets.filter_1_icon} alt="filter" />
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

        {showSettings && (
            <SettingsModal 
                onClose={() => setShowSettings(false)}
                onLogout={handleLogout}
            />
        )}
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