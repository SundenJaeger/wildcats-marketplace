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
        <div className="flex flex-col justify-top min-h-screen flex-1 max-w-[1000px] min-w-[300px] mx-2">
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
                    <div className='p-2 w-full h-full flex flex-col gap-4'>
                        <div className='flex justify-between'>
                            <div className='flex justify-evenly mb-2 mt-1 w-full'>
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
                        </div>

                        {/* Dynamic Component Rendering */}
                        <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
                            {adminView === 'reports' && <ReportsDashboard/>}
                            {adminView === 'verification' && <VerificationRequest/>}
                            {adminView === 'categories' && <CategoriesManagement/>}
                        </div>

                        {/* Exit Admin Mode Button */}
                        <div className='flex justify-end h-fit my-2'>
                            <button className='p-2 px-3 text-xs font-bold rounded-lg bg-red-800 text-white hover:bg-red-900 transition'
                                    onClick={handleLogout}>
                                Logout
                            </button>
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

                                        {(appliedFilters.category || appliedFilters.condition || appliedFilters.priceRange || appliedFilters.subFilters.length > 0) && (
                                            <div className='flex flex-wrap gap-2 my-3 items-center'>
                                                <span className='text-sm font-semibold text-gray-700'>Active Filters:</span>
                                                {appliedFilters.categoryName && (
                                                    <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'>
                                                        {appliedFilters.categoryName}
                                                    </span>
                                                )}
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