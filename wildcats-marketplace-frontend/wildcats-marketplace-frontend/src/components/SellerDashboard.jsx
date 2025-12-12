import React, {useState, useEffect} from 'react'
import assets from '../assets/assets'
import CreateListingModal from './CreateListingModal'
import {listingService} from '../services/listingService';
import ListingDetailModal from './ListingDetailModal';

const SellerDashboard = ({searchQuery}) => {
    const [isActiveListing, setIsActiveListing] = useState(false)
    const [createNewListing, setCreateNewListing] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userListings, setUserListings] = useState([])
    const [filteredListings, setFilteredListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        const loadUserData = () => {
            try {
                const storedData = localStorage.getItem('userData')
                if (storedData) {
                    const parsedData = JSON.parse(storedData)
                    setUserData(parsedData)

                    if (parsedData.studentId) {
                        fetchUserListings(parsedData.studentId)
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUserData()
    }, [])

    const fetchUserListings = async (studentId) => {
        try {
            setListingsLoading(true)
            // Use the new function that includes images
            const listings = await listingService.getUserListingsWithImages(studentId)
            setUserListings(listings)
            setFilteredListings(listings)
            setIsActiveListing(listings.length > 0)
        } catch (error) {
            console.error('Error fetching user listings:', error)
            // Fallback to old method if new one fails
            try {
                const oldListings = await listingService.getUserListings(studentId)
                setUserListings(oldListings)
                setFilteredListings(oldListings)
                setIsActiveListing(oldListings.length > 0)
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
            }
        } finally {
            setListingsLoading(false)
        }
    }

    // Filter listings based on search query
    useEffect(() => {
        if (!searchQuery || !searchQuery.trim()) {
            setFilteredListings(userListings);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = userListings.filter(listing => {
            const title = listing.title?.toLowerCase() || '';
            const description = listing.description?.toLowerCase() || '';
            const status = listing.status?.toLowerCase() || '';
            const condition = listing.condition?.toLowerCase() || '';

            return title.includes(query) ||
                description.includes(query) ||
                status.includes(query) ||
                condition.includes(query);
        });

        setFilteredListings(filtered);
    }, [searchQuery, userListings]);

    const handleSuccess = () => {
        setShowSuccessAlert(true);
        if (userData?.studentId) {
            fetchUserListings(userData.studentId)
        }

        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };

    const formatStudentId = (studentId) => {
        if (!studentId) return 'N/A';
        if (typeof studentId === 'string' && studentId.includes('-')) {
            return studentId;
        }
        return `19-${studentId}`;
    };

    const getFullName = () => {
        if (!userData) return 'Loading...';
        return userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    const handleListingClick = (listing) => {
        setSelectedListing(listing);
    };

    const handleListingUpdate = () => {
        if (userData?.studentId) {
            fetchUserListings(userData.studentId);
        }
    };

    const handleListingDelete = () => {
        if (userData?.studentId) {
            fetchUserListings(userData.studentId);
        }
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A31800] mb-4"></div>
                <p className='font-bold text-red-950'>Loading profile...</p>
            </div>
        )
    }

    return (
        <div
            className='flex flex-col w-full h-screen justify-top bg-linear-to-b from-[#FFF7DA] to-transparent p-6 rounded-tl-lg'>
            <br></br>
            {/* Overview */}

            <div
                className='flex flex-col items-center justify-center gap-2 py-5 mb-3 bg-center border-red-900 rounded-lg bg-linear-to-t from-red-900 to-red-800'
            >
                <div className="flex flex-col items-center justify-center">
                    <h2
                        className="font-sans text-3xl font-extrabold text-amber-400"
                        style={{
                            textShadow: `
                                -2px -2px 0 #6e1000,
                                2px -2px 0 #6e1000,
                                -2px 2px 0 #6e1000,
                                2px 2px 0 #6e1000,
                                -2px 0 0 #6e1000,
                                2px 0 0 #6e1000,
                                0 -2px 0 #6e1000,
                                0 2px 0 #6e1000,
                                3px 3px 6px rgba(0,0,0,0.4)
                            `
                        }}
                    >
                        Seller Dashboard
                    </h2>
                    <p
                        className="font-sans font-extrabold text-amber-400 text-md"
                        style={{
                            textShadow: `
                                -1px -1px 0 #6e1000,
                                1px -1px 0 #6e1000,
                                -1px 1px 0 #6e1000,
                                1px 1px 0 #6e1000,
                                2px 2px 4px rgba(0,0,0,0.3)
                            `
                        }}
                    >
                        Create new and manage existing categories
                    </p>
                </div>
            </div>

            <div className="bg-[#fffbee] rounded-md shadow-md border-2 border-[#530c00]/70  overflow-hidden">
                {/* Toolbar */}
                <div
                    className="flex flex-col items-center justify-between gap-4 p-4 border-b-2 border-red-900 bg-linear-to-l from-red-900 to-red-700 sm:flex-row">
                    <div className="flex gap-2 p-2 bg-red-900 border-2 border-red-900 rounded-lg">
                        <div className='flex flex-col items-start justify-center px-4 bg-red-800 rounded-md h-13'>
                            <img src={assets.white_user} className='h-6 w-9'></img>
                        </div>

                        <div className='flex flex-col items-start justify-center w-full px-4 rounded-md'>
                            <h2 className="mr-1 text-lg font-semibold text-white">
                                {getFullName()}
                            </h2>
                            <h3 className="mb-1 text-xs font-semibold text-white">
                                {userData?.email || 'No email provided'}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={() => setCreateNewListing(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-amber-100 text-[#4d0c00] text-sm rounded-md font-semibold hover:bg-[#ffedad] hover:text-red-950 hover:scale-101 transition-colors border-2 border-amber-900/30 shadow-xs'>
                        + Create Listing
                    </button>
                </div>
                <div
                    className='flex bg-red-900 border-b-2 border-[#580d00] py-3 shadow-md space-x-4 px-5 items-center justify-between'>
                    <h1 className="text-lg! text-white font-bold">
                        {searchQuery ? `Search Results (${filteredListings.length})` : 'YOUR LISTINGS'}
                    </h1>
                    <div className='flex gap-2'>
                        <h3 className="text-sm font-bold text-white">
                            ACTIVE LISTINGS:
                        </h3>
                        <h2 className="text-sm font-bold text-white">
                            {userListings.length}
                        </h2>
                    </div>
                </div>
                <div
                    className='bg-[#FFF7DA] p-4 shadow-md flex space-x-4 px-5 min-h-[50vh]'>
                    {listingsLoading ? (
                        <div className='flex items-center justify-center w-full max-h-full'>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A31800] mb-4"></div>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className='flex items-center justify-center w-full max-h-full'>
                            <div
                                className='box-border flex flex-col items-center justify-center w-full h-full gap-2 pb-15'>
                                <img className='w-15 h-15' src={assets.empty_space_icon}></img>
                                <h3 className='font-bold text-red-900'>
                                    {searchQuery ? `No listings found for "${searchQuery}"` : 'Poof! Its empty...'}
                                </h3>
                                <p className='text-sm text-gray-600'>
                                    {searchQuery ? 'Try a different search term' : 'Create your first listing!'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid w-full grid-cols-3 gap-4">
                            {filteredListings.map(listing => {
                                // Sort images by displayOrder to ensure primary image is first
                                const sortedImages = listing.images
                                    ? [...listing.images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                    : [];

                                const primaryImage = sortedImages.length > 0
                                    ? listingService.getImageUrl(sortedImages[0].imagePath)
                                    : listing.primaryImage;

                                return (
                                    <div
                                        key={listing.resourceId}
                                        onClick={() => handleListingClick(listing)}
                                        className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Updated image display */}
                                        {primaryImage ? (
                                            <img
                                                src={primaryImage}
                                                alt={listing.title}
                                                className="object-cover w-full h-48"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-48 bg-gray-200">
                                                <span className="text-gray-500">No image</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="mb-2 text-lg font-bold text-red-900 truncate">{listing.title}</h3>
                                            <p className="mb-2 text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-red-700">{formatPrice(listing.price)}</span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                            listing.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {listing.status}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                {new Date(listing.datePosted).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {createNewListing && (
                <CreateListingModal
                    onClose={() => setCreateNewListing(false)}
                    onSuccess={handleSuccess}>
                </CreateListingModal>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <div
                    className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#FFF7DA] border-2 border-rose-950 text-black px-6 py-3 rounded-lg shadow-lg z-[60] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="font-semibold">Listing created successfully!</span>
                </div>
            )}

            {selectedListing && (
                <ListingDetailModal
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                    onUpdate={handleListingUpdate}
                    onDelete={handleListingDelete}
                />
            )}
        </div>
    )
}

export default SellerDashboard