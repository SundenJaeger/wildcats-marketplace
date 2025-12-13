import React, {useState, useEffect} from 'react' // Added useEffect
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
    // 1. Extract isAdmin from location state (passed from Login)
    const {isNewUser, username, isAdmin: isAdminState} = location.state || {};

    const [isMarketplaceView, setIsMarketplaceView] = React.useState(true);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [showSettings, setShowSettings] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);

    // 2. Initialize isAdmin from state, defaulting to false
    const [isAdmin, setIsAdmin] = React.useState(isAdminState || false);

    const [showProductFilter, setShowProductFilter] = React.useState(false);
    const [showProductPost, setShowProductPost] = useState(false)
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

    // 3. Persist Admin Mode on Refresh
    useEffect(() => {
        // If we didn't get state from navigation (e.g. page refresh), check localStorage
        if (!isAdminState) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const role = userData.userType || userData.type || (userData.user && userData.user.type);

            if (role === 'A') {
                setIsAdmin(true);
            }
        }
    }, [isAdminState]);

    const handleLogout = () => {
        setShowSettings(false);
        // Clear admin state on logout
        setIsAdmin(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        navigate('/', {state: {hasLoggedOut: true}});
    };

    const toggleSavedProducts = () => {
        setShowSavedProducts(!showSavedProducts);
    };

    // Handle notification click - navigate to product
    const handleNotificationProductClick = (resource) => {
        // Transform notification resource to match your product structure
        let imageUrls = [];
        if (resource.images && resource.images.length > 0) {
            imageUrls = resource.images
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map(img => {
                    if (img.imageUrl) {
                        return img.imageUrl;
                    }
                    else if (img.imagePath) {
                        if (img.imagePath.startsWith('http')) {
                            return img.imagePath;
                        }
                        return `http://localhost:8080/uploads/${img.imagePath}`;
                    }
                    else if (typeof img === 'string') {
                        return img.startsWith('http')
                            ? img
                            : `http://localhost:8080/uploads/${img}`;
                    }
                    return null;
                })
                .filter(url => url !== null);
        }

        const productData = {
            id: resource.resourceId,
            name: resource.title,
            price: `₱${Number(resource.price).toFixed(2)}`,
            priceValue: Number(resource.price),
            category: resource.category?.categoryName || 'Uncategorized',
            seller: resource.student?.user
                ? `${resource.student.user.firstName || ''} ${resource.student.user.lastName || ''}`.trim()
                : 'Unknown Seller',
            description: resource.description || 'No description available',
            condition: resource.condition,
            status: resource.status,
            datePosted: resource.datePosted,
            imageList: imageUrls,
            sellerId: resource.student?.studentId || 'N/A',
            categoryInfo: resource.category
        };

        setSelectedProduct(null);
        setIsMarketplaceView(true);

        setTimeout(() => {
            setSelectedProduct(productData);
        }, 0);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setShowProductFilter(false);
    };

    const handleCloseProductPost = () => {
        setShowProductPost(false)
        setSelectedProduct(null)
    }

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
        <div className="flex flex-col justify-top min-h-screen flex-1 max-w-[1000px] min-w-[300px] mx-5">
            <Navbar
                isAdmin={isAdmin}
                onAdminClick={() => setIsAdmin(true)} // Dev helper (optional)
                onSettingsClick={() => setShowSettings(true)}
                onNotificationsClick={() => setShowNotifications(true)}
                onProfileClick={() => setShowProfile(true)}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
            />

            {/* ADMIN DASHBOARD VIEW */}
            {isAdmin ? (
                <>
                    <div className='flex flex-col w-full h-full p-2'>
                        <div className='flex justify-between'>
                            <div className='flex justify-between w-full mt-1'>
                                <div className='flex ml-8 justify-evenly'>
                                    <button
                                        className={`w-40 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
                                    ${adminView === 'reports' ? 'bg-[#FFF7DA] ' : 'bg-gray'}`}
                                        onClick={() => setAdminView('reports')}>
                                        Reports
                                    </button>
                                    <button
                                        className={`w-40 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
                                    ${adminView === 'verification' ? 'bg-[#FFF7DA] ' : 'bg-gray'}`}
                                        onClick={() => setAdminView('verification')}>
                                        Verification
                                    </button>
                                    <button
                                        className={`w-40 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
                                    ${adminView === 'categories' ? 'bg-[#FFF7DA] ' : 'bg-gray'}`}
                                        onClick={() => setAdminView('categories')}>
                                        Categories
                                    </button>
                                </div>

                                {/* Exit Admin Mode Button */}
                                <div className='flex justify-end my-2 h-fit'>
                                    <button className='p-2 px-4 text-sm font-bold text-white transition bg-red-800 rounded-lg hover:bg-red-900'
                                            onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Component Rendering */}
                        <div className="bg-linear-to-b from-[#FFF7DA] to-transparent  rounded-lg  min-h-[500px] px-8 pt-3">
                            {adminView === 'reports' && <ReportsDashboard/>}
                            {adminView === 'verification' && <VerificationRequest/>}
                            {adminView === 'categories' && <CategoriesManagement/>}
                        </div>
                    </div>
                </>
            ) : (
                /* STUDENT / PUBLIC VIEW */
                <>
                    {!selectedProduct ? (
                        <>
                            <div className='flex justify-evenly'>
                                <button
                                    className={`w-1/2 pb-2 pt-1 font-bold text-xl  text-red-950 focus:outline-none rounded-t-lg
                            ${isMarketplaceView ? ' bg-[#FFF7DA] ' : 'bg-[#ffeb99]'}`}
                                    onClick={() => setIsMarketplaceView(true)}>
                                    Marketplace
                                </button>
                                <button
                                    className={`w-1/2 pb-2 pt-1 font-bold text-xl text-red-950 focus:outline-none rounded-t-lg
                            ${!isMarketplaceView ? 'bg-[#FFF7DA]' : 'bg-[#ffeb99]'}`}
                                    onClick={() => setIsMarketplaceView(false)}>
                                    Seller Dashboard
                                </button>
                            </div>
                            {/* Marketplace */}
                            {isMarketplaceView && (
                                <div className='bg-linear-to-b from-[#FFF7DA] to-transparent rounded-tr-lg pb-8'>
                                    <div className='flex flex-col items-center justify-center mt-5 mb-2'>
                                        <img src={assets.homepage_welcome_banner}
                                            alt="Wildcats"
                                            className="object-contain w-[95%] h-full my-1 rounded-lg"
                                        />
                                    </div>

                                    <div className='px-6'>
                                        <div className="bg-[#fffbee] rounded-md shadow-md border-2 border-red-950 overflow-hidden">
                                            {/* Header Bar */}
                                            <div className='flex items-center justify-between px-5 py-3 border-b-2 shadow-md bg-linear-to-r from-red-900 to-red-700 border-red-950'>
                                                <h3 className='text-lg font-bold text-white'>
                                                    {showSavedProducts ? 'SAVED PRODUCTS' :
                                                        searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` :
                                                            "TODAY'S PICKS"}
                                                </h3>
                                                <div className='flex gap-2 p-1 bg-red-900 border-2 border-red-900 rounded-lg'>
                                                    <button
                                                        type="button"
                                                        className={`flex justify-center items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all border-2 ${
                                                            showSavedProducts
                                                                ? 'border-[#3e0200] rounded-md bg-[#820400] text-gray-200 shadow-sm scale-99'
                                                                : 'border-[#810400] rounded-md bg-[#ac0600] shadow-sm text-white'
                                                        }`}
                                                        onClick={toggleSavedProducts}>
                                                        <img className="w-3 h-3" src={assets.white_save_icon} alt="save"/>
                                                        Saved
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all border-2 border-[#810400] rounded-md bg-[#ac0600] shadow-sm"
                                                        onClick={() => setShowProductFilter(!showProductFilter)}>
                                                        <img className="w-4 h-4" src={assets.white_filter_icon} alt="filter"/>
                                                        Filter
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Active Filters */}
                                            {(appliedFilters.category || appliedFilters.condition || appliedFilters.priceRange || appliedFilters.subFilters.length > 0) && (
                                                <div className='flex flex-wrap items-center gap-2 px-5 py-3 bg-red-800 border-b border-red-900'>
                                                    <span className='text-sm font-semibold text-white'>Active Filters:</span>
                                                    {appliedFilters.categoryName && (
                                                        <span className='px-3 py-1 text-xs font-semibold text-red-800 rounded-full bg-amber-50'>
                                                            {appliedFilters.categoryName}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={clearFilters}
                                                        className='text-xs font-semibold underline text-amber-50 hover:text-white'>
                                                        Clear All
                                                    </button>
                                                </div>
                                            )}

                                            {/* Products Content */}
                                            <div className='bg-[#FFF7DA] p-4 min-h-[50vh]'>
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
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Seller Dashboard */}
                            {!(isMarketplaceView) && (
                                <>
                                    <div className='flex flex-col w-full justify-top'>
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

            {/* Modals */}
            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onLogout={handleLogout}
                />
            )}
            {showNotifications && (
                <NotificationsModal
                    onClose={() => setShowNotifications(false)}
                    onProductClick={handleNotificationProductClick}
                />
            )}
            {showProductPost && selectedProduct && (
                <ProductPost
                    product={selectedProduct}
                    onBack={handleCloseProductPost}
                    onUpdateProduct={(updated) => setSelectedProduct(updated)}
                />
            )}
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