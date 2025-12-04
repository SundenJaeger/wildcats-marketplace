import React, {useState, useEffect} from 'react';
import assets from '../assets/assets';
import {bookmarkService} from '../services/bookmarkService';
import {Camera} from 'lucide-react';

const SavedProducts = ({onProductClick, filters}) => {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rawSavedProducts, setRawSavedProducts] = useState([]);

    useEffect(() => {
        fetchSavedProducts();
    }, []);

    const fetchSavedProducts = async () => {
        try {
            setLoading(true);
            const userData = JSON.parse(localStorage.getItem('userData'));

            if (!userData || !userData.studentId) {
                setError('Please log in to view saved products');
                setLoading(false);
                return;
            }

            const bookmarks = await bookmarkService.getStudentBookmarks(userData.studentId);

            const transformedBookmarks = bookmarks.map(bookmark => {
                const priceValue = bookmark.price ?
                    parseFloat(bookmark.price.replace(/[^0-9.-]+/g, "")) : 0;

                return {
                    ...bookmark,
                    priceValue: priceValue,
                    condition: bookmark.condition || 'GOOD',
                    category: bookmark.category || 'Uncategorized'
                };
            });

            setRawSavedProducts(transformedBookmarks);
            setSavedProducts(bookmarks);
            setError(null);
        } catch (err) {
            console.error('Error fetching saved products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!filters || (!filters.category && !filters.condition && !filters.priceRange &&
            (!filters.subFilters || filters.subFilters.length === 0))) {
            // No filters applied, show all saved products
            setSavedProducts(rawSavedProducts);
            return;
        }

        const filtered = rawSavedProducts.filter(product => {
            if (filters.priceRange) {
                const price = product.priceValue || 0;
                switch (filters.priceRange) {
                    case '-100':
                        if (price >= 100) return false;
                        break;
                    case '100-499':
                        if (price < 100 || price >= 500) return false;
                        break;
                    case '500-999':
                        if (price < 500 || price >= 1000) return false;
                        break;
                    case '999+':
                        if (price < 1000) return false;
                        break;
                }
            }

            if (filters.condition) {
                const conditionMap = {
                    'bnew': 'NEW',
                    'excellent': 'LIKE_NEW',
                    'good': 'GOOD',
                    'used': 'FAIR',
                    'poor': 'POOR'
                };

                if (product.condition !== conditionMap[filters.condition]) {
                    return false;
                }
            }

            if (filters.categoryName) {
                if (product.category !== filters.categoryName) {
                    const matchesSubcategory = filters.subFilters &&
                        filters.subFilters.some(subFilter =>
                            product.category === subFilter
                        );

                    if (!matchesSubcategory) {
                        return false;
                    }
                }
            }

            if (filters.subFilters && filters.subFilters.length > 0) {
                const hasMatchingSubfilter = filters.subFilters.some(subfilter => {
                    return product.category === subfilter ||
                        (product.category && product.category.includes(subfilter));
                });

                if (!hasMatchingSubfilter) {
                    return false;
                }
            }

            return true;
        });

        setSavedProducts(filtered);
    }, [filters, rawSavedProducts]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-red-950 font-semibold">Loading saved products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex flex-col items-center justify-center h-96 bg-[#FFF7DA] rounded-lg border-2 border-[#A31800]">
                <img className='w-20 h-20 mb-4' src={assets.warning_icon} alt="Error"/>
                <h3 className="text-red-900 font-bold text-xl mb-2">Error</h3>
                <p className="text-red-900 text-sm">{error}</p>
            </div>
        );
    }

    if (savedProducts.length === 0) {
        const hasActiveFilters = filters && (
            filters.category || filters.condition || filters.priceRange ||
            (filters.subFilters && filters.subFilters.length > 0)
        );
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-[#FFF7DA] rounded-lg border-2 border-[#A31800]">
                <img className='w-20 h-20 mb-4' src={assets.warning_icon} alt="No saved items" />
                <h3 className="text-red-900 font-bold text-xl mb-2">
                    {hasActiveFilters ? 'No Matching Saved Items' : 'No Saved Items'}
                </h3>
                <p className="text-red-900 text-sm">
                    {hasActiveFilters
                        ? 'No saved products match your current filters.'
                        : 'You haven\'t saved any products yet.'}
                </p>
                {hasActiveFilters && (
                    <p className="text-red-900 text-sm mt-2">Try adjusting your filter criteria</p>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2">
            {savedProducts.map((product) => (
                <div
                    key={product.bookmarkId}
                    onClick={() => onProductClick(product)}
                    className="flex flex-col bg-[#FFF7D7] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-100 border-1 border-[#FFF7D7] hover:border-[#A31800] my-2"
                >
                    {/* Product Image */}
                    <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                        {product.imageList && product.imageList.length > 0 ? (
                            <img
                                src={product.imageList[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div style={{display: product.imageList && product.imageList.length > 0 ? 'none' : 'flex'}}
                             className="w-full h-full items-center justify-center">
                            <Camera className='w-12 h-12 text-gray-400'/>
                        </div>
                        <div
                            className="absolute top-2 right-2 bg-[#A31800] text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Saved
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-black font-bold text-sm mb-1 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-[#A31800] font-extrabold text-lg mb-2">
                            {product.price}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
                            <p className="font-semibold">
                                <span className="text-gray-500">Category:</span> {product.category}
                            </p>
                            <p className="font-semibold">
                                <span className="text-gray-500">Seller:</span> {product.seller}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedProducts;