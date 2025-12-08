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
                                <div className='flex w-2/3 ml-10 justify-evenly'>
                                    <button
                                        className={`w-70 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
                                    ${adminView === 'reports' ? 'bg-[#FFF7DA] ' : 'bg-gray'}`}
                                        onClick={() => setAdminView('reports')}>
                                        Reports
                                    </button>
                                    <button
                                        className={`w-70 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
                                    ${adminView === 'verification' ? 'bg-[#FFF7DA] ' : 'bg-gray'}`}
                                        onClick={() => setAdminView('verification')}>
                                        Verification
                                    </button>
                                    <button
                                        className={`w-70 px-2 whitespace-nowrap rounded-t-xl pb-[0.5%] font-bold text-lg bg-gray text-red-950 focus:outline-none
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
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-2xl font-bold text-black '>
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
                                            <div className='flex flex-wrap items-center gap-2 my-3'>
                                                <span className='text-sm font-semibold text-gray-700'>Active Filters:</span>
                                                {appliedFilters.categoryName && (
                                                    <span className='px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full'>
                                                        {appliedFilters.categoryName}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={clearFilters}
                                                    className='text-xs font-semibold text-red-600 underline hover:text-red-800'>
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
                                    <div className='flex flex-col w-full h-screen justify-top'>
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