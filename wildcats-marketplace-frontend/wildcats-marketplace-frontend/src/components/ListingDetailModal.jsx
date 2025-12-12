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
        condition: mapEnumToCondition(listing.condition), // Map enum to dropdown value on init
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

        // If it's an existing image, store its ID
        if (selectedImage.imageId) {
            setSelectedImageId(selectedImage.imageId);
        }

        // If not in edit mode and it's an existing image, save the change immediately
        if (!isEditing && selectedImage.imageId) {
            try {
                setLoading(true);
                console.log('=== Setting primary image (view mode) ===');
                console.log('Selected index:', index);
                console.log('Selected image ID:', selectedImage.imageId);
                console.log('All images:', images.map(img => ({ id: img.imageId, order: img.displayOrder })));

                await listingService.updatePrimaryImage(listing.resourceId, selectedImage.imageId);

                // Close modal and refresh - this will re-fetch the listing with new image order
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

            console.log('=== SAVE PROCESS START ===');
            console.log('Current editedListing.condition:', editedListing.condition);
            console.log('Converting to enum:', mapConditionToEnum(editedListing.condition));

            // Update basic listing info - include ALL required fields from original listing
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

            console.log('Updating listing with data:', updateData);
            console.log('Resource ID:', listing.resourceId);

            const updatedResource = await listingService.updateResource(listing.resourceId, updateData);
            console.log('Update response:', updatedResource);

            // Upload new images if any
            if (newImages.length > 0) {
                console.log('Uploading', newImages.length, 'new images...');
                await listingService.uploadImages(listing.resourceId, newImages);
            }

            // Update primary image if an existing image was selected
            if (selectedImageId && images.length > 0) {
                console.log('=== Setting primary image (edit mode) ===');
                console.log('Selected image ID:', selectedImageId);
                await listingService.updatePrimaryImage(listing.resourceId, selectedImageId);
            }

            onUpdate();
            setIsEditing(false);
            setNewImages([]);
            setPrimaryImageIndex(0);
        } catch (error) {
            console.error('Error updating listing:', error);
            console.error('Error details:', error.message);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FFF7D7] rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-red-900 to-red-700 text-white p-4 flex justify-between items-center rounded-t-lg">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Images */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                {isEditing ? 'Images (Click to set as primary)' : 'Product Images'}
                            </h3>

                            {/* Main Image Display */}
                            <div className="mb-4">
                                {allImages.length > 0 ? (
                                    <div className="relative">
                                        <img
                                            src={allImages[primaryImageIndex]?.fullUrl || allImages[primaryImageIndex]?.url}
                                            alt={editedListing.title}
                                            className="w-full h-80 object-cover rounded-lg border-2 border-red-900"
                                        />
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                            Primary Image
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                        <span className="text-gray-500">No images</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Grid */}
                            {isEditing ? (
                                <div className="flex flex-wrap gap-3">
                                    {allImages.map((image, idx) => (
                                        <div
                                            key={image.imageId || image.id}
                                            onClick={() => setPrimaryImage(idx)}
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer group ${
                                                idx === primaryImageIndex ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image.fullUrl || image.url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {idx === primaryImageIndex && (
                                                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">Primary</span>
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
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12}/>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {totalImages < maxImages && (
                                        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-900 hover:bg-red-50 transition-all">
                                            <Upload size={20} className="text-gray-500 mb-1"/>
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
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {allImages.map((img, idx) => (
                                            <img
                                                key={img.imageId || idx}
                                                src={img.fullUrl || img.url}
                                                alt={`${editedListing.title} ${idx + 1}`}
                                                onClick={() => setPrimaryImage(idx)}
                                                className={`w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75 ${
                                                    idx === primaryImageIndex ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )
                            )}

                            {totalImages === maxImages && isEditing && (
                                <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                                    <p className="text-rose-950 text-xs font-medium text-center">
                                        Maximum images reached
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Details */}
                        <div>
                            {isEditing ? (
                                <div className="space-y-4 bg-white rounded-2xl p-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                                        <div className="bg-gray-100 rounded-md">
                                            <input
                                                type="text"
                                                value={editedListing.title}
                                                onChange={(e) => setEditedListing({...editedListing, title: e.target.value})}
                                                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                                        <div className="bg-gray-100 rounded-md">
                                            <textarea
                                                value={editedListing.description}
                                                onChange={(e) => setEditedListing({...editedListing, description: e.target.value})}
                                                rows="4"
                                                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none resize-none"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Price (₱) *</label>
                                        <div className="bg-gray-100 rounded-md">
                                            <input
                                                type="number"
                                                value={editedListing.price}
                                                onChange={(e) => setEditedListing({...editedListing, price: parseFloat(e.target.value)})}
                                                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                                                min="0"
                                                step="0.01"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                                        <div className="bg-gray-100 rounded-md p-2">
                                            <select
                                                value={mapEnumToCondition(editedListing.condition)}
                                                onChange={(e) => setEditedListing({...editedListing, condition: e.target.value})}
                                                className="w-full bg-gray-100 px-2 rounded-md font-semibold focus:outline-none appearance-none"
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
                                <div className="space-y-4 bg-white rounded-2xl p-5">
                                    <h3 className="text-2xl font-bold text-red-900">{listing.title}</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>

                                    <div className="flex items-center justify-between py-3 border-t border-b border-gray-200">
                                        <span className="text-3xl font-bold text-red-700">{formatPrice(listing.price)}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                listing.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                            {listing.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="font-semibold text-gray-600 block mb-1">Condition:</span>
                                            <span className="text-gray-800 font-medium">{getConditionDisplay(listing.condition)}</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="font-semibold text-gray-600 block mb-1">Posted:</span>
                                            <span className="text-gray-800 font-medium">
                                                {new Date(listing.datePosted).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                {!isEditing ? (
                                    <>
                                        {/* Status Change Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange('AVAILABLE')}
                                                disabled={loading || listing.status === 'AVAILABLE'}
                                                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
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
                                                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
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
                                                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-md font-semibold hover:bg-amber-600 hover:scale-105 transition-all"
                                            >
                                                Edit Details
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                disabled={loading}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:scale-105 transition-all"
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
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                                            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 hover:scale-105 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-lg">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete this listing? This action cannot be undone and all images will be removed.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600"
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