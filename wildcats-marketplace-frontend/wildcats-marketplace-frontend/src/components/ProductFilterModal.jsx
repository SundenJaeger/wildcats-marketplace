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
                const response = await fetch('http://localhost:8000/categories/active/');

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();
                console.log('Fetched categories:', data);

                setCategories(data);
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
                    const response = await fetch(`http://localhost:8000/categories/${selectedCat.categoryId}/subcategories`);

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
        const selectedCat = categories.find(cat => cat.category_id === parseInt(chosenCategory));

        onApplyFilters({
            category: chosenCategory,
            categoryName: selectedCat?.category_name || '',
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
        <div className='fixed inset-0 flex flex-col items-center justify-center bg-black/40 z-51'>
            <div className='flex flex-col justify-start rounded-md p-4 bg-[#FFF4CB] w-130 max-h-[90vh] overflow-y-auto'>

                <div className='flex items-start justify-between'>
                    <div className='flex flex-col mt-5 mb-2 ml-5'>
                        <h2 className='text-xl font-bold text-black'>Filter</h2>
                    </div>
                    <div onClick={onClose}
                         className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer'>
                        <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
                    </div>
                </div>

                {/* Line Break */}
                <div className='flex justify-center items-center w-auto h-[1px] bg-black mt-2 mx-1'></div>

                {/* Main Body */}
                <div className='flex flex-col justify-between h-auto gap-1 py-5 items-between'>

                    {/* Main Categories */}
                    <div className='flex items-center w-full gap-1 px-3 py-2 my-1 bg-white rounded-lg text-start min-h-16'>
                        <h3 className='mx-1 font-bold text-black w-31'>Category:</h3>
                        <div className='relative flex w-full'>
                            {loadingCategories ? (
                                <div className='w-full px-2 py-1 font-semibold text-gray-500'>
                                    Loading categories...
                                </div>
                            ) : categories.length === 0 ? (
                                <div className='w-full px-2 py-1 font-semibold text-gray-500'>
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
                                        className='justify-between w-full px-2 font-semibold text-black bg-white rounded-md appearance-none focus:outline-none focus:ring-0'
                                    >
                                        <option value=''>All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    <img className='absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2' src={assets.drop_down_icon}></img>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Condition of Products */}
                    <div className='flex items-center w-full h-16 gap-1 px-3 my-1 bg-white rounded-lg text-start'>
                        <h3 className='m-1 font-bold text-black w-31'>Condition:</h3>
                        <div className='relative flex w-full'>
                            <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='justify-between w-full px-2 font-semibold text-black bg-white rounded-md appearance-none focus:outline-none focus:ring-0'>
                                <option value='bnew' >Brand New</option>
                                <option value='excellent' >Excellent</option>
                                <option value='good' >Good</option>
                                <option value='used' >Used</option>
                                <option value='poor' >Poor</option>
                            </select>
                            <img className='absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2' src={assets.drop_down_icon}></img>
                        </div>
                    </div>

                    {/* Price Range of Products */}
                    <div className='flex items-center w-full h-16 gap-1 px-3 my-1 bg-white rounded-lg text-start'>
                        <h3 className='m-1 font-bold text-black w-31'>Price Range:</h3>
                        <div className='relative flex w-full'>
                            <select value={chosenPriceRange} onChange={(e) => setChosenPriceRange(e.target.value)} className='justify-between w-full px-2 font-semibold text-black bg-white rounded-md appearance-none focus:outline-none focus:ring-0'>
                                <option value='-100' > {"< ₱100"}</option>
                                <option value='100-499' >{"₱100 - ₱499"}</option>
                                <option value='500-999' >{"₱500 - ₱999"}</option>
                                <option value='999+' >{"> ₱999"}</option>
                            </select>
                            <img className='absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2' src={assets.drop_down_icon}></img>
                        </div>
                    </div>

                    {/*/!* Subcategories Section *!/*/}
                    {/*{chosenCategory && (*/}
                    {/*    <div className='relative w-full h-auto'>*/}
                    {/*        <div className="items-center w-full h-full gap-2 p-2 pl-3 my-2 bg-white rounded-lg text-start">*/}
                    {/*            {loadingSubcategories ? (*/}
                    {/*                <div className='p-2 font-semibold text-gray-500'>*/}
                    {/*                    Loading subcategories...*/}
                    {/*                </div>*/}
                    {/*            ) : subcategories.length > 0 ? (*/}
                    {/*                <div>*/}
                    {/*                    <h3 className="mb-2 font-bold text-black">Subcategories:</h3>*/}
                    {/*                    <div className="flex flex-col gap-1 ml-3">*/}
                    {/*                        {subcategories.map((subcategory) => (*/}
                    {/*                            <button*/}
                    {/*                                key={subcategory.categoryId}*/}
                    {/*                                onClick={() => toggleFilter(subcategory.categoryName)}*/}
                    {/*                                className="flex items-center gap-2 font-semibold text-black"*/}
                    {/*                            >*/}
                    {/*      <span*/}
                    {/*          className={`border-2 border-gray-400 w-3 h-3 rounded-full*/}
                    {/*        ${chosenFilters.includes(subcategory.categoryName) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}*/}
                    {/*      ></span>*/}
                    {/*                                <label className='text-left'>{subcategory.categoryName}</label>*/}
                    {/*                            </button>*/}
                    {/*                        ))}*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            ) : (*/}
                    {/*                <div className='p-2 font-semibold text-gray-500'>*/}
                    {/*                    No subcategories available*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                </div>

                {/* Action Buttons */}
                <div className='flex justify-end gap-3 mt-4'>
                    <button
                        onClick={handleClear}
                        className='px-6 py-2 font-semibold text-white transition-colors bg-gray-400 rounded-lg hover:bg-gray-500'>
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