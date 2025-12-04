import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'

const ProductFilterModal = ({onClose, onApplyFilters, currentFilters}) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [chosenCategory, setChosenCategory] = useState(currentFilters?.category || '');
    const [chosenCondition, setChosenCondition] = useState(currentFilters?.condition || 'bnew');
    const [chosenPriceRange, setChosenPriceRange] = useState(currentFilters?.priceRange || '-100');
    const [chosenFilters, setChosenFilters] = useState(currentFilters?.subFilters || []);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                // Fetch main categories (parent categories only)
                const response = await fetch('http://localhost:8080/api/categories/main');

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();
                console.log('Fetched categories:', data);

                // Filter only active categories
                const activeCategories = data.filter(cat => cat.isActive);
                setCategories(activeCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Set empty array on error
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch subcategories when a category is selected
    const [subcategories, setSubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!chosenCategory) {
                setSubcategories([]);
                return;
            }

            try {
                setLoadingSubcategories(true);
                // Find the selected category object to get its ID
                const selectedCat = categories.find(cat => cat.categoryId === parseInt(chosenCategory));

                if (selectedCat) {
                    const response = await fetch(`http://localhost:8080/api/categories/${selectedCat.categoryId}/subcategories`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch subcategories');
                    }

                    const data = await response.json();
                    console.log('Fetched subcategories:', data);

                    // Filter only active subcategories
                    const activeSubcategories = data.filter(sub => sub.isActive);
                    setSubcategories(activeSubcategories);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            } finally {
                setLoadingSubcategories(false);
            }
        };

        fetchSubcategories();
    }, [chosenCategory, categories]);

    const toggleFilter = (filter) => {
        setChosenFilters((prevFilters) =>
            prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
        );
    };

    const handleApply = () => {
        // Find the selected category name for display
        const selectedCat = categories.find(cat => cat.categoryId === parseInt(chosenCategory));

        onApplyFilters({
            category: chosenCategory,
            categoryName: selectedCat?.categoryName || '',
            condition: chosenCondition,
            priceRange: chosenPriceRange,
            subFilters: chosenFilters
        });
    };

    const handleClear = () => {
        setChosenCategory('');
        setChosenCondition('bnew');
        setChosenPriceRange('-100');
        setChosenFilters([]);
        setSubcategories([]);
    };

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
            <div className='flex flex-col justify-start rounded-md p-4 border bg-[#FFF4CB] w-130 max-h-[90vh] overflow-y-auto'>

                <div className='flex justify-between items-start'>
                    <div className='flex flex-col ml-5 mt-5 mb-2'>
                        <h2 className='text-black font-bold text-xl'>Filter</h2>
                    </div>
                    <div onClick={onClose}
                         className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer'>
                        <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
                    </div>
                </div>

                {/* Line Break */}
                <div className='flex justify-center items-center w-auto h-[1px] bg-black mt-2 mx-1'></div>

                {/* Main Body */}
                <div className='flex flex-col justify-between items-between py-5 h-auto gap-1'>

                    {/* Main Categories */}
                    <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full min-h-16 px-3 py-2'>
                        <h3 className='text-black font-bold mx-1 w-31'>Category:</h3>
                        <div className='relative w-full flex'>
                            {loadingCategories ? (
                                <div className='w-full px-2 py-1 text-gray-500 font-semibold'>
                                    Loading categories...
                                </div>
                            ) : categories.length === 0 ? (
                                <div className='w-full px-2 py-1 text-gray-500 font-semibold'>
                                    No categories available
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={chosenCategory}
                                        onChange={(e) => {
                                            setChosenCategory(e.target.value);
                                            setChosenFilters([]); // Clear sub-filters when category changes
                                        }}
                                        className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'
                                    >
                                        <option value=''>All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Condition of Products */}
                    <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full h-16 px-3'>
                        <h3 className='text-black font-bold m-1 w-31'>Condition:</h3>
                        <div className='relative w-full flex'>
                            <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                                <option value='bnew' >Brand New</option>
                                <option value='excellent' >Excellent</option>
                                <option value='good' >Good</option>
                                <option value='used' >Used</option>
                                <option value='poor' >Poor</option>
                            </select>
                            <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
                        </div>
                    </div>

                    {/* Price Range of Products */}
                    <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full h-16 px-3'>
                        <h3 className='text-black font-bold m-1 w-31'>Price Range:</h3>
                        <div className='relative w-full flex'>
                            <select value={chosenPriceRange} onChange={(e) => setChosenPriceRange(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                                <option value='-100' > {"< ₱100"}</option>
                                <option value='100-499' >{"₱100 - ₱499"}</option>
                                <option value='500-999' >{"₱500 - ₱999"}</option>
                                <option value='999+' >{"> ₱999"}</option>
                            </select>
                            <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
                        </div>
                    </div>

                    {/* Subcategories Section */}
                    {chosenCategory && (
                        <div className='relative w-full h-auto'>
                            <div className="items-center text-start gap-2 my-2 bg-white rounded-lg w-full h-full p-2 pl-3">
                                {loadingSubcategories ? (
                                    <div className='text-gray-500 font-semibold p-2'>
                                        Loading subcategories...
                                    </div>
                                ) : subcategories.length > 0 ? (
                                    <div>
                                        <h3 className="text-black font-bold mb-2">Subcategories:</h3>
                                        <div className="flex flex-col gap-1 ml-3">
                                            {subcategories.map((subcategory) => (
                                                <button
                                                    key={subcategory.categoryId}
                                                    onClick={() => toggleFilter(subcategory.categoryName)}
                                                    className="flex items-center gap-2 text-black font-semibold"
                                                >
                          <span
                              className={`border-2 border-gray-400 w-3 h-3 rounded-full
                            ${chosenFilters.includes(subcategory.categoryName) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}
                          ></span>
                                                    <label className='text-left'>{subcategory.categoryName}</label>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='text-gray-500 font-semibold p-2'>
                                        No subcategories available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 justify-end mt-4'>
                    <button
                        onClick={handleClear}
                        className='px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors'>
                        Clear
                    </button>
                    <button
                        onClick={handleApply}
                        className='px-6 py-2 bg-[#B20000] text-white font-semibold rounded-lg hover:bg-[#8b0000] transition-colors'>
                        Apply
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProductFilterModal