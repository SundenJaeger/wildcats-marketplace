import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const PhotoCard = ({ image, name, price, category, seller, onClick }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            onClick={onClick}
            className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200'
        >
            <div className='relative w-full h-48 bg-gray-200 flex items-center justify-center'>
                {!imageError && image ? (
                    <img
                        src={image}
                        alt={name}
                        className='w-full h-full object-cover'
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Camera className='w-12 h-12 text-gray-400' />
                )}
            </div>
            <div className='p-3'>
                <h3 className='font-semibold text-gray-800 truncate'>{name}</h3>
                <p className='text-lg font-bold text-red-600'>{price}</p>
                <p className='text-sm text-gray-600 truncate'>{category}</p>
                <p className='text-xs text-gray-500 truncate'>Seller: {seller}</p>
            </div>
        </div>
    );
};

const Products = ({onProductClick, filters, searchQuery}) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);

                // Use search endpoint if searchQuery exists, otherwise use available endpoint
                const url = searchQuery && searchQuery.trim()
                    ? `http://localhost:8080/api/resources/search?keyword=${encodeURIComponent(searchQuery)}`
                    : 'http://localhost:8080/api/resources/available';

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch resources');
                }

                const data = await response.json();
                console.log('Raw backend data:', data);

                // Transform backend data to match frontend structure
                const transformedData = data.map(resource => {
                    // Handle student name
                    let firstName = 'Unknown';
                    let lastName = '';

                    if (resource.student) {
                        if (resource.student.firstName) {
                            firstName = resource.student.firstName;
                            lastName = resource.student.lastName || '';
                        }
                        else if (resource.student.user) {
                            firstName = resource.student.user.firstName || 'Unknown';
                            lastName = resource.student.user.lastName || '';
                        }
                    }

                    const sellerName = `${firstName} ${lastName}`.trim();

                    // Handle ALL images
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

                    const transformed = {
                        id: resource.resourceId,
                        name: resource.title,
                        price: `₱${Number(resource.price).toFixed(2)}`,
                        priceValue: Number(resource.price), // Keep numeric value for filtering
                        category: resource.category?.categoryName || 'Uncategorized',
                        seller: sellerName || 'Unknown Seller',
                        description: resource.description || 'No description available',
                        condition: resource.condition,
                        status: resource.status,
                        datePosted: resource.datePosted,
                        imageList: imageUrls,
                        sellerId: resource.student?.studentId || resource.student?.user?.userId || 'N/A',
                        // Store original category info for filtering
                        categoryInfo: resource.category
                    };

                    return transformed;
                });

                setProductList(transformedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching resources:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [searchQuery]); // Re-fetch when search query changes

    // Filter products based on applied filters
    const filteredProducts = React.useMemo(() => {
        if (!filters || (!filters.category && !filters.condition && !filters.priceRange && filters.subFilters.length === 0)) {
            return productList;
        }

        return productList.filter(product => {
            // Price filter
            if (filters.priceRange) {
                const price = product.priceValue;
                switch(filters.priceRange) {
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

            // Condition filter
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

            // Category filter - now using category ID
            if (filters.category) {
                // Check if product's category ID matches the selected category
                // or if the product's parent category matches
                const productCategoryId = product.categoryInfo?.categoryId;
                const productParentCategoryId = product.categoryInfo?.parentCategory?.categoryId;
                const selectedCategoryId = parseInt(filters.category);

                // Match if either the category itself matches OR its parent category matches
                const categoryMatches = productCategoryId === selectedCategoryId ||
                    productParentCategoryId === selectedCategoryId;

                if (!categoryMatches) {
                    return false;
                }
            }

            // Subcategory filters
            if (filters.subFilters && filters.subFilters.length > 0) {
                // Check if the product's category name matches any of the selected subcategories
                const hasMatchingSubfilter = filters.subFilters.some(subfilter => {
                    return product.category === subfilter ||
                        product.category.includes(subfilter);
                });

                if (!hasMatchingSubfilter) {
                    return false;
                }
            }

            return true;
        });
    }, [productList, filters]);

    if (loading) {
        return (
            <div className='flex justify-center items-center py-10'>
                <div className='text-red-950 font-semibold'>Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center py-10'>
                <div className='text-red-800 font-semibold'>Error: {error}</div>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center py-10'>
                <div className='text-gray-600 font-semibold mb-2'>
                    {searchQuery ? `No products found for "${searchQuery}"` : 'No products match your filters'}
                </div>
                <div className='text-sm text-gray-500'>
                    {searchQuery ? 'Try a different search term' : 'Try adjusting your filter criteria'}
                </div>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2'>
            {filteredProducts.map((product) => (
                <PhotoCard
                    key={product.id}
                    image={product.imageList[0]}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    seller={product.seller}
                    onClick={() => onProductClick(product)}
                />
            ))}
        </div>
    );
};

export default Products;