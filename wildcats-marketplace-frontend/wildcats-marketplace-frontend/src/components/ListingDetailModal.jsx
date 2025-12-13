import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { listingService } from '../services/listingService';

const ListingDetailModal = ({ listing, onClose, onUpdate, onDelete }) => {
    const maxImages = 4;

    // Define mapping functions FIRST before using them in state
    const mapConditionToEnum = (condition) => {
        const conditionMap = {
            'bnew': 'NEW',
            'excellent': 'LIKE_NEW',
            'good': 'GOOD',
            'used': 'FAIR',
            'poor': 'POOR'
        };
        console.log('mapConditionToEnum input:', condition, 'output:', conditionMap[condition] || 'GOOD');
        return conditionMap[condition] || 'GOOD';
    };

    const mapEnumToCondition = (enumValue) => {
        const enumMap = {
            'NEW': 'bnew',
            'LIKE_NEW': 'excellent',
            'GOOD': 'good',
            'FAIR': 'used',
            'POOR': 'poor'
        };
        // If it's already a dropdown value, return it as-is
        if (['bnew', 'excellent', 'good', 'used', 'poor'].includes(enumValue)) {
            console.log('mapEnumToCondition - already dropdown format:', enumValue);
            return enumValue;
        }
        console.log('mapEnumToCondition input:', enumValue, 'output:', enumMap[enumValue] || 'good');
        return enumMap[enumValue] || 'good';
    };

    const getConditionDisplay = (condition) => {
        const displayMap = {
            'bnew': 'Brand New',
            'excellent': 'Excellent',
            'good': 'Good',
            'used': 'Used',
            'poor': 'Poor',
            'NEW': 'Brand New',
            'LIKE_NEW': 'Excellent',
            'GOOD': 'Good',
            'FAIR': 'Used',
            'POOR': 'Poor'
        };
        return displayMap[condition] || condition;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    // Now define state that uses these functions
    const [isEditing, setIsEditing] = useState(false);
    const [editedListing, setEditedListing] = useState({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        condition: mapEnumToCondition(listing.condition),
        status: listing.status
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [images, setImages] = useState(listing.images || []);
    const [newImages, setNewImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [selectedImageId, setSelectedImageId] = useState(listing.images?.[0]?.imageId || null);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = images.length + newImages.length;
        const remainingSlots = maxImages - totalImages;
        const filesToAdd = files.slice(0, remainingSlots);

        const filePromises = filesToAdd.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: Date.now() + Math.random(),
                        url: reader.result,
                        file: file,
                        isNew: true
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then((uploadedImages) => {
            setNewImages((prev) => [...prev, ...uploadedImages]);
        });

        e.target.value = '';
    };

    const removeExistingImage = (imageId) => {
        setImages((prev) => prev.filter((img) => img.imageId !== imageId));
        if (primaryImageIndex >= images.length - 1) {
            setPrimaryImageIndex(Math.max(0, images.length - 2));
        }
    };

    const removeNewImage = (id) => {
        setNewImages((prev) => prev.filter((img) => img.id !== id));
    };

    const setPrimaryImage = async (index) => {
        setPrimaryImageIndex(index);
        const allImages = [...images, ...newImages];
        const selectedImage = allImages[index];

        if (selectedImage.imageId) {
            setSelectedImageId(selectedImage.imageId);
        }

        if (!isEditing && selectedImage.imageId) {
            try {
                setLoading(true);
                await listingService.updatePrimaryImage(listing.resourceId, selectedImage.imageId);
                onUpdate();
                onClose();
            } catch (error) {
                console.error('Error updating primary image:', error);
                alert('Failed to update primary image: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setLoading(true);
            await listingService.updateResourceStatus(listing.resourceId, newStatus);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editedListing.title.trim()) {
            alert('Please enter a title');
            return;
        }

        if (!editedListing.description.trim()) {
            alert('Please enter a description');
            return;
        }

        if (!editedListing.price || isNaN(parseFloat(editedListing.price)) || parseFloat(editedListing.price) <= 0) {
            alert('Please enter a valid price');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                resourceId: listing.resourceId,
                title: editedListing.title,
                description: editedListing.description,
                price: parseFloat(editedListing.price),
                condition: mapConditionToEnum(editedListing.condition),
                status: listing.status,
                datePosted: listing.datePosted,
                dateSold: listing.dateSold,
                student: {
                    studentId: listing.student.studentId
                },
                category: {
                    categoryId: listing.category.categoryId
                }
            };

            await listingService.updateResource(listing.resourceId, updateData);

            if (newImages.length > 0) {
                await listingService.uploadImages(listing.resourceId, newImages);
            }

            if (selectedImageId && images.length > 0) {
                await listingService.updatePrimaryImage(listing.resourceId, selectedImageId);
            }

            onUpdate();
            setIsEditing(false);
            setNewImages([]);
            setPrimaryImageIndex(0);
        } catch (error) {
            console.error('Error updating listing:', error);
            alert(`Failed to update listing: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await listingService.deleteResource(listing.resourceId);
            onDelete();
            onClose();
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing');
        } finally {
            setLoading(false);
        }
    };

    const allImages = [...images, ...newImages];
    const totalImages = allImages.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[#FFF7D7] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 text-white rounded-t-lg bg-linear-to-r from-red-900 to-red-700">
                    <h2 className="text-2xl font-bold">
                        {isEditing ? 'Edit Listing' : 'Listing Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`text-white text-2xl font-bold w-8 h-8 rounded-full flex items-center justify-center ${loading ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-red-800'}`}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Two Column Layout - Images and Details */}
                    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                        {/* Left Column - Images Section */}
                        <div>
                            <h3 className="mb-3 text-base font-bold text-gray-800">
                                {isEditing ? 'Images (Click to set as primary)' : 'Product Images'}
                            </h3>

                            {/* Main Image Display */}
                            <div className="mb-3">
                                {allImages.length > 0 ? (
                                    <div className="relative">
                                        <img
                                            src={allImages[primaryImageIndex]?.fullUrl || allImages[primaryImageIndex]?.url}
                                            alt={editedListing.title}
                                            className="object-cover w-full border-2 rounded-xl border-amber-950/60 h-72"
                                        />
                                        <div className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full top-2 left-2">
                                            Primary
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full bg-gray-200 border-2 border-gray-300 rounded-lg h-72">
                                        <span className="text-sm text-gray-500">No images</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Grid */}
                            {isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                    {allImages.map((image, idx) => (
                                        <div
                                            key={image.imageId || image.id}
                                            onClick={() => setPrimaryImage(idx)}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer group ${
                                                idx === primaryImageIndex ? 'ring-3 ring-blue-500' : 'ring-2 ring-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image.fullUrl || image.url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            {idx === primaryImageIndex && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-30">
                                                    <span className="text-xs font-bold text-white">1°</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (image.isNew) {
                                                        removeNewImage(image.id);
                                                    } else {
                                                        removeExistingImage(image.imageId);
                                                    }
                                                }}
                                                disabled={loading}
                                                className="absolute p-0.5 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-0.5 right-0.5 group-hover:opacity-100"
                                            >
                                                <X size={10}/>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {totalImages < maxImages && (
                                        <label className="flex flex-col items-center justify-center w-16 h-16 transition-all border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-red-900 hover:bg-red-50">
                                            <Upload size={16} className="mb-0.5 text-gray-500"/>
                                            <span className="text-xs text-gray-600">{totalImages}/{maxImages}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                multiple
                                                disabled={loading}
                                            />
                                        </label>
                                    )}
                                </div>
                            ) : (
                                allImages.length > 1 && (
                                    <div className="flex gap-2 pb-2 overflow-x-auto">
                                        {allImages.map((img, idx) => (
                                            <img
                                                key={img.imageId || idx}
                                                src={img.fullUrl || img.url}
                                                alt={`${editedListing.title} ${idx + 1}`}
                                                onClick={() => setPrimaryImage(idx)}
                                                className={`w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75 shrink-0 ${
                                                    idx === primaryImageIndex ? 'ring-3 ring-blue-500' : 'ring-2 ring-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )
                            )}

                            {totalImages === maxImages && isEditing && (
                                <div className="p-2 mt-2 border rounded-lg bg-rose-50 border-rose-200">
                                    <p className="text-xs font-medium text-center text-rose-950">
                                        Maximum images reached
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Details Section */}
                        <div>
                            <h3 className="mb-3 text-base font-bold text-gray-800">Product Details</h3>
                            
                            {isEditing ? (
                                <div className="p-4 space-y-3 bg-[#f3f0df] h-[290px] border-2 border-amber-950/60 rounded-xl flex flex-col">
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700">Title *</label>
                                        <input
                                            type="text"
                                            value={editedListing.title}
                                            onChange={(e) => setEditedListing({...editedListing, title: e.target.value})}
                                            className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white border rounded-md border-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block mb-1 text-xs font-bold text-gray-700">Description *</label>
                                        <textarea
                                            value={editedListing.description}
                                            onChange={(e) => setEditedListing({...editedListing, description: e.target.value})}
                                            className="w-full h-[calc(100%-24px)] px-3 py-2 text-xs font-medium leading-relaxed text-gray-700 bg-white border border-amber-200/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block mb-1 text-xs font-bold text-gray-700">Price (₱) *</label>
                                            <input
                                                type="number"
                                                value={editedListing.price}
                                                onChange={(e) => setEditedListing({...editedListing, price: parseFloat(e.target.value)})}
                                                className="w-full px-3 py-2 text-xs font-bold text-red-900 border rounded-md bg-white border-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                min="0"
                                                step="0.01"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-xs font-bold text-gray-700">Condition *</label>
                                            <select
                                                value={mapEnumToCondition(editedListing.condition)}
                                                onChange={(e) => setEditedListing({...editedListing, condition: e.target.value})}
                                                className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white border rounded-md appearance-none border-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                                disabled={loading}
                                            >
                                                <option value='bnew'>Brand New</option>
                                                <option value='excellent'>Excellent</option>
                                                <option value='good'>Good</option>
                                                <option value='used'>Used</option>
                                                <option value='poor'>Poor</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3 bg-[#fffef7] h-[290px] border-2 border-amber-950/50 rounded-xl">
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900">{listing.title}</h3>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-gray-200">
                                        <span className="text-2xl font-bold text-red-900">{formatPrice(listing.price)}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                listing.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                            {listing.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="p-2.5 rounded-lg bg-gray-50">
                                            <span className="block mb-1 font-semibold text-gray-600">Condition</span>
                                            <span className="font-medium text-gray-800">{getConditionDisplay(listing.condition)}</span>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-gray-50">
                                            <span className="block mb-1 font-semibold text-gray-600">Posted</span>
                                            <span className="font-medium text-gray-800">
                                                {new Date(listing.datePosted).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        {!isEditing ? (
                            <>
                                {/* Status Change Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusChange('AVAILABLE')}
                                        disabled={loading || listing.status === 'AVAILABLE'}
                                        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
                                            listing.status === 'AVAILABLE'
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                                        }`}
                                    >
                                        Mark as Available
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('SOLD')}
                                        disabled={loading || listing.status === 'SOLD'}
                                        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
                                            listing.status === 'SOLD'
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                                        }`}
                                    >
                                        Mark as Sold
                                    </button>
                                </div>

                                {/* Edit and Delete Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white transition-all rounded-md bg-amber-500 hover:bg-amber-600 hover:scale-105"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white transition-all bg-red-600 rounded-md hover:bg-red-700 hover:scale-105"
                                    >
                                        Delete Listing
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center justify-center flex-1 gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all bg-green-600 rounded-md hover:bg-green-700 hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedListing({
                                            title: listing.title,
                                            description: listing.description,
                                            price: listing.price,
                                            condition: mapEnumToCondition(listing.condition),
                                            status: listing.status
                                        });
                                        setImages(listing.images || []);
                                        setNewImages([]);
                                        setPrimaryImageIndex(0);
                                    }}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white transition-all bg-gray-500 rounded-md hover:bg-gray-600 hover:scale-105"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 rounded-lg">
                        <div className="w-full max-w-md p-6 bg-white rounded-lg">
                            <h3 className="mb-4 text-xl font-bold text-gray-900">Confirm Delete</h3>
                            <p className="mb-6 text-sm text-gray-700">
                                Are you sure you want to delete this listing? This action cannot be undone and all images will be removed.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingDetailModal;