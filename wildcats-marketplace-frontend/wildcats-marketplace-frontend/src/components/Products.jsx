import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

// Make sure API_BASE_URL does NOT include /api if your Django URLs don't
const API_BASE_URL = 'http://localhost:8000';

const PhotoCard = ({ image, name, price, category, seller, onClick }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            onClick={onClick}
            className="flex flex-col bg-[#fffbe9] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-100 border-2 border-red-900 hover:border-[#A31800] my-2"
        >
            <div className="relative flex items-center justify-center w-full h-48 bg-gray-200 border-b-2 border-red-900">
                {!imageError && image ? (
                    <img
                        src={image}
                        alt={name}
                        className="object-cover w-full h-full"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                )}
            </div>
            <div className="flex flex-col p-3 grow ">
                <h3 className="mb-1 text-sm font-bold text-black line-clamp-2">{name}</h3>
                <p className="text-[#A31800] font-extrabold text-lg mb-2">{price}</p>
                <div className="flex flex-col gap-1 mb-2 text-xs text-gray-600">
                    <p className="font-semibold">
                        <span className="text-gray-500">Category:</span> {category}
                    </p>
                    <p className="font-semibold">
                        <span className="text-gray-500">Seller:</span> {seller}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Products = ({ onProductClick, filters, searchQuery }) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);

                // Match your Django URL exactly
                const url = searchQuery && searchQuery.trim()
                    ? `${API_BASE_URL}/resources/search/?keyword=${encodeURIComponent(searchQuery)}`
                    : `${API_BASE_URL}/resources/available/`;

                const response = await fetch(url);

                if (!response.ok) throw new Error('Failed to fetch resources');

                const data = await response.json();

                const transformedData = data.map(resource => {
                    // Build seller name
                    let firstName = 'Unknown', lastName = '';
                    if (resource.student) {
                        if (resource.student.firstName) {
                            firstName = resource.student.firstName;
                            lastName = resource.student.lastName || '';
                        } else if (resource.student.user) {
                            firstName = resource.student.user.firstName || 'Unknown';
                            lastName = resource.student.user.lastName || '';
                        }
                    }
                    const sellerName = resource.student?.user?.username || 'Unknown Seller';

                    // Build images array
                    let imageUrls = [];
                    if (resource.images && resource.images.length > 0) {
                        imageUrls = resource.images
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map(img => {
                                if (img.imageUrl) return img.imageUrl;
                                if (img.imagePath) {
                                    return img.imagePath.startsWith('http')
                                        ? img.imagePath
                                        : `${API_BASE_URL}/uploads/${img.imagePath}`;
                                }
                                if (typeof img === 'string') {
                                    return img.startsWith('http')
                                        ? img
                                        : `${API_BASE_URL}/uploads/${img}`;
                                }
                                return null;
                            })
                            .filter(url => url !== null);
                    }

                    // Transform resource to frontend-friendly object
                    return {
                        id: resource.resourceId,
                        name: resource.title,
                        price: `₱${Number(resource.price).toFixed(2)}`,
                        priceValue: Number(resource.price),
                        category: resource.category?.categoryName  || 'Uncategorized',
                        seller: sellerName || 'Unknown Seller',
                        condition: resource.condition,
                        status: resource.status,
                        imageList: imageUrls,
                        categoryInfo: resource.category
                            ? {
                                categoryId: resource.category.categoryId,
                                categoryName: resource.category.categoryName
                              }
                            : null
                    };
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
    }, [searchQuery]);

    const filteredProducts = React.useMemo(() => {
        if (
            !filters ||
            (!filters.category &&
            !filters.condition &&
            !filters.priceRange &&
            (!filters.subFilters || filters.subFilters.length === 0))
        ) {
            return productList;
        }

        return productList.filter(product => {
            // Price filter
            if (filters.priceRange) {
                const price = product.priceValue;
                if (
                    (filters.priceRange === '-100' && price >= 100) ||
                    (filters.priceRange === '100-499' && (price < 100 || price >= 500)) ||
                    (filters.priceRange === '500-999' && (price < 500 || price >= 1000)) ||
                    (filters.priceRange === '999+' && price < 1000)
                ) return false;
            }

            // Condition filter
            if (filters.condition) {
                const conditionMap = {
                    bnew: 'new',
                    excellent: 'excellent',
                    good: 'good',
                    used: 'used',
                    poor: 'poor'
                };
                if (product.condition !== conditionMap[filters.condition]) return false;
            }

            // Category filter
            if (filters.category && product.categoryInfo) {
                if (Number(product.categoryInfo.categoryId) !== Number(filters.category)) return false;
            }

            // SubFilters (category name includes)
            if (filters.subFilters?.length > 0) {
                const match = filters.subFilters.some(sub =>
                    product.category.toLowerCase().includes(sub.toLowerCase())
                );
                if (!match) return false;
            }

            return true;
        });
    }, [productList, filters]);

    if (loading) return (
        <div className='flex items-center justify-center py-10'>
            <div className='font-semibold text-red-950'>Loading products...</div>
        </div>
    );

    if (error) return (
        <div className='flex items-center justify-center py-10'>
            <div className='font-semibold text-red-800'>Error: {error}</div>
        </div>
    );

    if (filteredProducts.length === 0) return (
        <div className='flex flex-col items-center justify-center py-10'>
            <div className='mb-2 font-semibold text-gray-600'>
                {searchQuery ? `No products found for "${searchQuery}"` : 'No products match your filters'}
            </div>
            <div className='text-sm text-gray-500'>
                {searchQuery ? 'Try a different search term' : 'Try adjusting your filter criteria'}
            </div>
        </div>
    );

    return (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {filteredProducts.map(product => (
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
