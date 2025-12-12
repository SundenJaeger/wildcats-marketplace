import React, {useState, useEffect} from 'react'
import assets from '../assets/assets'
import {Upload, X} from 'lucide-react';
import {listingService} from '../services/listingService';

const CreateListingModal = ({onClose, onSuccess}) => {
    const [chosenCategory, setChosenCategory] = useState('academics');
    const [chosenCondition, setChosenCondition] = useState('bnew');
    const [price, setPrice] = useState('');
    const [chosenFilters, setChosenFilters] = useState([]);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });

    const maxImages = 4;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await listingService.getActiveCategories();
            setCategories(categoriesData);

            if (categoriesData.length > 0) {
                setChosenCategory(categoriesData[0].categoryId.toString());
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([
                {categoryId: 1, categoryName: 'Academic Books & Notes'},
                {categoryId: 2, categoryName: 'School Supplies'},
                {categoryId: 3, categoryName: 'General Items'}
            ]);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = maxImages - images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        console.log('Files selected:', files.length);
        console.log('Current images:', images.length);
        console.log('Files to add:', filesToAdd.length);

        // Process all files
        const filePromises = filesToAdd.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: Date.now() + Math.random(),
                        url: reader.result,
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        // Wait for all files to be read, then update state once
        Promise.all(filePromises).then((newImages) => {
            setImages((prev) => {
                const combined = [...prev, ...newImages];
                const limited = combined.slice(0, maxImages);
                console.log('Updated images array:', limited.length);
                return limited;
            });
        });

        e.target.value = '';
    };

    const removeImage = (id) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const toggleFilter = (filter) => {
        setChosenFilters((prevFilters) =>
            prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
        );
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const mapConditionToEnum = (condition) => {
        const conditionMap = {
            'bnew': 'NEW',
            'excellent': 'LIKE_NEW',
            'good': 'GOOD',
            'used': 'FAIR',
            'poor': 'POOR'
        };
        return conditionMap[condition] || 'GOOD';
    };

    const handleCreateListing = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }

        if (!formData.description.trim()) {
            alert('Please enter a description');
            return;
        }

        if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            alert('Please enter a valid price');
            return;
        }

        if (images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        setIsSubmitting(true);

        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.studentId) {
                throw new Error('User not logged in or student ID not found');
            }

            const listingData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price).toFixed(2),
                condition: mapConditionToEnum(chosenCondition),
                status: 'AVAILABLE',
                student: {studentId: userData.studentId},
                category: {categoryId: parseInt(chosenCategory)}
            };

            console.log('Creating listing with data:', listingData);
            console.log('Number of images to upload:', images.length);

            const createdListing = await listingService.createListing(listingData);
            console.log('Listing created:', createdListing);

            if (createdListing && createdListing.resourceId) {
                console.log('Uploading', images.length, 'images...');
                await listingService.uploadImages(createdListing.resourceId, images);
                console.log('All images uploaded successfully');
            }

            onClose();

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                }
            }, 100);

        } catch (error) {
            console.error('Error creating listing:', error);
            alert(`Failed to create listing: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            e.preventDefault();
            handleCreateListing();
        }
    };

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-200'>
            <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-[700px] w-200 rounded-lg">
                <div className='flex justify-between pl-3 mb-2 items-center'>
                    <div className='flex justify-between items-center mt-3'>
                        <h2 className='text-black font-bold text-xl'>Create Listing</h2>
                    </div>
                    <div
                        onClick={() => !isSubmitting && onClose()}
                        className={`flex justify-center items-center w-5 h-5 rounded-full cursor-pointer ${isSubmitting ? 'bg-gray-400' : 'bg-[#B20000] hover:bg-[#8B0000]'}`}>
                        <input
                            type="image"
                            className="w-2.5 h-2.5"
                            src={assets.white_close_icon}
                            alt="Close"
                        />
                    </div>
                </div>

                <div className='flex min-w-full h-full justify-between p-2 gap-5 box-border'>
                    {/* Left Side */}
                    <div className='flex flex-col p-2 bg-white min-w-[50%] rounded-2xl'>
                        <div className='flex flex-col'>
                            <div className='px-5 my-1'>
                                <label className='text-black p-1 font-bold'>Title *</label>
                                <div className='bg-gray-100 rounded-md'>
                                    <input
                                        className='w-full text-black p-2'
                                        type='text'
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder='Enter title...'
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className='px-5 my-1'>
                                <label className='text-black p-1 font-bold'>Description *</label>
                                <div className='bg-gray-100 rounded-md'>
                  <textarea
                      className='w-full text-black p-2 resize-none'
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder='Enter description...'
                      disabled={isSubmitting}
                  />
                                </div>
                            </div>

                            <div className='px-5 my-1'>
                                <label className='text-black p-1 font-bold'>Price (₱) *</label>
                                <div className='bg-gray-100 rounded-md'>
                                    <input
                                        className='w-full p-2'
                                        type='number'
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder='0.00'
                                        min="0"
                                        step="0.01"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className='px-5 my-1'>
                                <label className='text-black p-1 font-bold'>Category</label>
                                <div className='bg-gray-100 rounded-md p-2'>
                                    <select
                                        value={chosenCategory}
                                        onChange={(e) => setChosenCategory(e.target.value)}
                                        className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-gray-100 px-2 rounded-md text-black font-semibold'
                                        disabled={isSubmitting || categories.length === 0}
                                    >
                                        {categories.length === 0 ? (
                                            <option>Loading categories...</option>
                                        ) : (
                                            categories.map(category => (
                                                <option key={category.categoryId} value={category.categoryId}>
                                                    {category.categoryName}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className='px-5 my-1'>
                                <label className='text-black p-1 font-bold'>Condition</label>
                                <div className='bg-gray-100 rounded-md p-2'>
                                    <select
                                        value={chosenCondition}
                                        onChange={(e) => setChosenCondition(e.target.value)}
                                        className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-gray-100 px-2 rounded-md text-black font-semibold'
                                        disabled={isSubmitting}
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
                    </div>

                    {/* Right Side */}
                    <div className="flex items-start w-full">
                        <div className="bg-white rounded-2xl px-8 py-3 w-full h-full max-w-4xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">Upload Images *</h2>
                            <p className="text-sm text-gray-600 mb-4">Upload up to {maxImages} images (first image will
                                be primary)</p>

                            <div className="flex flex-wrap justify-around gap-4">
                                {images.map((image, idx) => (
                                    <div
                                        key={image.id}
                                        className="relative w-30 h-30 rounded-lg overflow-hidden shadow-md group"
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {idx === 0 && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                Primary
                                            </div>
                                        )}
                                        <button
                                            onClick={() => !isSubmitting && removeImage(image.id)}
                                            disabled={isSubmitting}
                                            className={`absolute top-2 right-2 text-white rounded-full p-1.5 transition-opacity duration-200 ${isSubmitting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <X size={16}/>
                                        </button>
                                    </div>
                                ))}

                                {images.length < maxImages && (
                                    <label
                                        className={`w-30 h-30 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${isSubmitting ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-[#B20000] hover:bg-red-50'}`}>
                                        <Upload size={32}
                                                className={`mb-2 ${isSubmitting ? 'text-gray-400' : 'text-gray-500'}`}/>
                                        <span
                                            className={`text-sm font-medium ${isSubmitting ? 'text-gray-400' : 'text-gray-600'}`}>
                      Upload Image
                    </span>
                                        <span className="text-xs text-gray-400 mt-1">
                      {images.length}/{maxImages}
                    </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            multiple
                                            disabled={isSubmitting}
                                        />
                                    </label>
                                )}
                            </div>

                            {images.length === maxImages && (
                                <div
                                    className="mt-6 p-2 bg-rose-50 border border-rose-200 rounded-lg flex justify-center items-center">
                                    <p className="text-rose-950 text-xs font-medium text-center">
                                        Maximum images reached
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div className='flex justify-end p-2 items-center'>
                    <button
                        onClick={handleCreateListing}
                        disabled={isSubmitting}
                        className={`rounded-lg text-xs font-extrabold p-2 px-5 flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B20000] hover:scale-105 hover:bg-[#8B0000]'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating...
                            </>
                        ) : (
                            'Create Listing'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateListingModal;