import React, {useState, useEffect} from 'react'
import assets from '../assets/assets'
import CreateListingModal from './CreateListingModal'
import {listingService} from '../services/listingService';

const SellerDashboard = ({searchQuery}) => {
    const [isActiveListing, setIsActiveListing] = useState(false)
    const [createNewListing, setCreateNewListing] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userListings, setUserListings] = useState([])
    const [filteredListings, setFilteredListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)

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

    if (loading) {
        return (
            <div className='flex flex-col justify-center items-center h-screen w-full'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A31800] mb-4"></div>
                <p className='text-red-950 font-bold'>Loading profile...</p>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-top h-screen w-full'>
            <br></br>
            {/* Overview */}
            <div className='flex flex-col mb-4 gap-2'>
                <h1 className="!text-3xl text-red-950 font-bold">Your Profile</h1>
                <div className='flex gap-5 justify-between'>
                    <div
                        className='flex bg-[#FFF7DA] border-2 border-[#A31800] py-3 rounded-lg shadow-md space-x-4 px-5 w-full'>
                        <div className='flex flex-col justify-center items-start p-2 px-4'>
                            <img src={assets.blank_profile_icon} className='w-22'></img>
                        </div>

                        <div className='flex flex-col justify-center items-start w-full rounded-md p-2 px-4'>
                            <div className='flex w-full mb-1'>
                                <h2 className="text-2xl text-red-950 font-bold mr-1">
                                    {getFullName()}
                                </h2>
                                {userData?.username && (
                                    <h2 className='text-gray-500 text-2xl font-bold'>
                                        ({userData.username})
                                    </h2>
                                )}
                            </div>
                            <h3 className="text-xs text-red-950 font-bold mb-1">
                                {formatStudentId(userData?.studentId)}
                            </h3>
                            <h3 className="text-xs text-red-950 font-bold mb-1">
                                {userData?.email || 'No email provided'}
                            </h3>
                        </div>
                    </div>

                    <div
                        className='flex bg-[#FFF7DA] border-2 border-[#A31800] py-3 rounded-lg shadow-md space-x-4 px-5 w-[50%]'>
                        <div className='flex justify-center items-center w-full rounded-md p-2 px-4'>
                            <div className='flex flex-col w-full mb-1 p-2'>
                                <h3 className="text-md text-red-950 font-bold mr-1">
                                    Active Listings
                                </h3>
                                <h2 className="text-4xl text-red-950 font-bold mb-1">
                                    {userListings.length}
                                </h2>
                            </div>
                            <img className='w-13 h-13 m-2' src={assets.listing_icon}/>
                        </div>
                    </div>
                </div>
            </div>

            <br className='h-3'></br>
            {/* Your Listings */}
            <div className='flex flex-col gap-2 my-2'>
                <div className='flex justify-between items-center '>
                    <h1 className="!text-3xl text-red-950 font-bold">
                        {searchQuery ? `Search Results (${filteredListings.length})` : 'Your Listings'}
                    </h1>
                    <button
                        onClick={() => setCreateNewListing(true)}
                        className='bg-[#8B0000] rounded-md text-[10px] p-2 px-4 font-bold hover:scale-102'>
                        + Create new Listing
                    </button>
                </div>

                <div
                    className='bg-[#FFF7DA] border-2 border-[#A31800] p-4 rounded-lg shadow-md flex space-x-4 px-5 min-h-[50vh]'>
                    {listingsLoading ? (
                        <div className='flex max-h-full w-full justify-center items-center'>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A31800] mb-4"></div>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className='flex max-h-full w-full justify-center items-center'>
                            <div
                                className='w-full h-full flex flex-col justify-center items-center pb-15 box-border gap-2'>
                                <img className='w-15 h-15' src={assets.empty_space_icon}></img>
                                <h3 className='text-red-900 font-bold'>
                                    {searchQuery ? `No listings found for "${searchQuery}"` : 'Poof! Its empty...'}
                                </h3>
                                <p className='text-gray-600 text-sm'>
                                    {searchQuery ? 'Try a different search term' : 'Create your first listing!'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4 w-full">
                            {filteredListings.map(listing => (
                                <div key={listing.resourceId}
                                     className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                    {/* Updated image display */}
                                    {listing.primaryImage ? (
                                        <img
                                            src={listing.primaryImage}
                                            alt={listing.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    ) : listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={listingService.getImageUrl(listing.images[0].imagePath)}
                                            alt={listing.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No image</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-red-900 mb-2 truncate">{listing.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-red-700">{formatPrice(listing.price)}</span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {listing.status}
                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {new Date(listing.datePosted).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
        </div>
    )
}

export default SellerDashboard