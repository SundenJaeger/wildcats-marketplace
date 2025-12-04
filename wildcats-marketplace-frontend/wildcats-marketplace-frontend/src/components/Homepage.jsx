import React from 'react'
import assets from '../assets/assets'
import Products from './Products'
import SavedProducts from './SavedProducts'
import SellerDashboard from './SellerDashboard';
import ProductPost from './ProductPost';
import SettingsModal from './SettingsModal';
import NotificationsModal from './NotificationsModal';
import ProfileModal from './ProfileModal';
import Navbar from './Navbar';
import ProductFilterModal from './ProductFilterModal'
import VerificationModel from './VerificationModal';
import ReportsDashboard from './ReportsDashboard';
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import VerificationRequest from './VerificationRequest';
import CategoriesManagement from './CategoriesManagement';

const Homepage = () => {
    const location = useLocation();
    const {isNewUser, username} = location.state || {};
    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [showSettings, setShowSettings] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false)
    const [showProductFilter, setShowProductFilter] = React.useState(false);
    const [showVerificationModal, setShowVerificationModal] = React.useState(isNewUser);
    const [adminView, setAdminView] = React.useState('reports');
    const [showSavedProducts, setShowSavedProducts] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Filter states
    const [appliedFilters, setAppliedFilters] = React.useState({
        category: null,
        condition: null,
        priceRange: null,
        subFilters: []
    });

    const navigate = useNavigate();
    const handleLogout = () => {
        setShowSettings(false);
        navigate('/', {state: {hasLoggedOut: true}});
    };

    const toggleSavedProducts = () => {
        setShowSavedProducts(!showSavedProducts);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setShowProductFilter(false);
    };

    const clearFilters = () => {
        setAppliedFilters({
            category: null,
            condition: null,
            priceRange: null,
            subFilters: []
        });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="flex flex-col justify-top min-h-screen flex-1 max-w-[1000px] min-w-[300px] mx-2">
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
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
            />
            {isAdmin ? (
                <>
                    <div className='p-2 w-full h-full flex flex-col gap-4'>
                        <div className='flex justify-between'>
                            <div className='flex justify-evenly mb-2 mt-1'>
                                <button
                                    className={`w-1/3 px-3 border-b-4 whitespace-nowrap pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'reports' ? 'border-red-950' : 'border-transparent'}`}
                                    onClick={() => setAdminView('reports')}>
                                    Listing Reports
                                </button>
                                <button
                                    className={`w-1/3 px-3 border-b-4 whitespace-nowrap pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'verification' ? 'border-red-950' : 'border-transparent'}`}
                                    onClick={() => setAdminView('verification')}>
                                    Verification Requests
                                </button>
                                <button
                                    className={`w-1/3 px-3 border-b-4 whitespace-nowrap pb-[0.5%] font-bold text-xl bg-transparent text-red-950 focus:outline-none
                                ${adminView === 'categories' ? 'border-red-950' : 'border-transparent'}`}
                                    onClick={() => setAdminView('categories')}>
                                    Categories
                                </button>
                            </div>
                            <div className='flex justify-end h-fit my-2'>
                                <button className='p-2 px-3 text-xs font-bold rounded-lg bg-red-800 text-white'
                                        onClick={() => setIsAdmin(false)}>Go Back
                                </button>
                            </div>
                        </div>
                        {/* REPORTS VIEW */}
                        {adminView === 'reports' && <ReportsDashboard/>}
                        {/* VERIFICATION REQUESTS VIEW */}
                        {adminView === 'verification' && <VerificationRequest/>}
                        {/* CATEGORIES MANAGEMENT VIEW */}
                        {adminView === 'categories' && <CategoriesManagement/>}
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
                                            <h3 className='text-black font-bold text-2xl '>
                                                {showSavedProducts ? 'Saved Products' :
                                                    searchQuery ? `Search Results for "${searchQuery}"` :
                                                        "Today's Picks"}
                                            </h3>
                                            <div className='flex gap-2'>
                                                <button
                                                    type="button"
                                                    className={`flex justify-center items-center gap-1 w-25 p-1.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                                                        showSavedProducts
                                                            ? 'bg-[#8b0000]'
                                                            : 'bg-[#a50000]'
                                                    }`}
                                                    onClick={toggleSavedProducts}>
                                                    <img className="w-3 h-3" src={assets.white_save_icon} alt="save"/>
                                                    Saved
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex justify-center items-center gap-1 w-25 bg-[#a50000] p-1.5 px-4 rounded-lg text-sm font-semibold"
                                                    onClick={() => setShowProductFilter(!showProductFilter)}>
                                                    <img className="w-4 h-4" src={assets.white_filter_icon}
                                                         alt="filter"/>
                                                    Filter
                                                </button>
                                            </div>
                                        </div>

                                        {/* Active Filters Display */}
                                        {(appliedFilters.category || appliedFilters.condition || appliedFilters.priceRange || appliedFilters.subFilters.length > 0) && (
                                            <div className='flex flex-wrap gap-2 my-3 items-center'>
                                                <span
                                                    className='text-sm font-semibold text-gray-700'>Active Filters:</span>
                                                {appliedFilters.categoryName && (
                                                    <span
                                                        className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'>
                                                {appliedFilters.categoryName}
                                            </span>
                                                )}
                                                {appliedFilters.condition && (
                                                    <span
                                                        className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'>
                                                {appliedFilters.condition === 'bnew' ? 'Brand New' :
                                                    appliedFilters.condition === 'excellent' ? 'Excellent' :
                                                        appliedFilters.condition === 'good' ? 'Good' :
                                                            appliedFilters.condition === 'used' ? 'Used' : 'Poor'}
                                            </span>
                                                )}
                                                {appliedFilters.priceRange && (
                                                    <span
                                                        className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'>
                                                {appliedFilters.priceRange === '-100' ? '< ₱100' :
                                                    appliedFilters.priceRange === '100-499' ? '₱100 - ₱499' :
                                                        appliedFilters.priceRange === '500-999' ? '₱500 - ₱999' : '> ₱999'}
                                            </span>
                                                )}
                                                {appliedFilters.subFilters.map((filter, index) => (
                                                    <span key={index}
                                                          className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'>
                                                {filter}
                                            </span>
                                                ))}
                                                <button
                                                    onClick={clearFilters}
                                                    className='text-red-600 text-xs font-semibold underline hover:text-red-800'>
                                                    Clear All
                                                </button>
                                            </div>
                                        )}

                                        {showSavedProducts ? (
                                            <SavedProducts onProductClick={setSelectedProduct}
                                                           filters={appliedFilters}
                                                           searchQuery={searchQuery}
                                            />
                                        ) : (
                                            <Products
                                                onProductClick={setSelectedProduct}
                                                filters={appliedFilters}
                                                searchQuery={searchQuery}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                            {/* Seller Dashboard */}
                            {!(isMarketplaceView) && (
                                <>
                                    <div className='flex flex-col justify-top h-screen w-full'>
                                        <SellerDashboard searchQuery={searchQuery}/>
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
            {showNotifications && (<NotificationsModal onClose={() => setShowNotifications(false)}/>)}
            {showProfile && (<ProfileModal onClose={() => setShowProfile(false)}/>)}
            {showProductFilter && (
                <ProductFilterModal
                    onClose={() => setShowProductFilter(false)}
                    onApplyFilters={handleApplyFilters}
                    currentFilters={appliedFilters}
                />
            )}
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