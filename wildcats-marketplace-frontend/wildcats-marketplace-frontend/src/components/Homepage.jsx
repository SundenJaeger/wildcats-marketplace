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
import ReportsDashboard from './ReportsDashboard';
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
    const [showVerificationModal, setShowVerificationModal] = React.useState(isNewUser);
    const [adminView, setAdminView] = React.useState('reports'); // 'reports' or 'verification'
    
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
                                className={`w-1/2 px-3 border-b-4 whitespace-nowrap pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'reports' ? 'border-red-950' : 'border-transparent'}`}
                                onClick={() => setAdminView('reports')}>
                                Listing Reports
                            </button>
                            <button
                                className={`w-full px-3 border-b-4 whitespace-nowrap pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
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
                    {adminView === 'reports' && <ReportsDashboard />}
                    {/* VERIFICATION REQUESTS VIEW */}
                    {adminView === 'verification' && <VerificationRequest />}
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