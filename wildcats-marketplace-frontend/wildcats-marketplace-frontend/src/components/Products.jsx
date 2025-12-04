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

const Products = ({onProductClick}) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/resources/available');

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

                    // Handle ALL images - THIS IS THE FIX
                    let imageUrls = [];

                    if (resource.images && resource.images.length > 0) {
                        // Map ALL images, not just the first one
                        imageUrls = resource.images
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) // Sort by display order
                            .map(img => {
                                // Check if image has imageUrl property
                                if (img.imageUrl) {
                                    return img.imageUrl;
                                }
                                // Check if image has imagePath property
                                else if (img.imagePath) {
                                    // Handle full URLs vs relative paths
                                    if (img.imagePath.startsWith('http')) {
                                        return img.imagePath;
                                    }
                                    return `http://localhost:8080/uploads/${img.imagePath}`;
                                }
                                // Check if it's just a string
                                else if (typeof img === 'string') {
                                    return img.startsWith('http')
                                        ? img
                                        : `http://localhost:8080/uploads/${img}`;
                                }
                                return null;
                            })
                            .filter(url => url !== null); // Remove any null values
                    }

                    const transformed = {
                        id: resource.resourceId,
                        name: resource.title,
                        price: `₱${Number(resource.price).toFixed(2)}`,
                        category: resource.category?.categoryName || 'Uncategorized',
                        seller: sellerName || 'Unknown Seller',
                        description: resource.description || 'No description available',
                        condition: resource.condition,
                        status: resource.status,
                        datePosted: resource.datePosted,
                        imageList: imageUrls, // Now contains ALL images
                        sellerId: resource.student?.studentId || resource.student?.user?.userId || 'N/A'
                    };

                    console.log('Transformed product:', transformed);
                    console.log('Number of images:', imageUrls.length);
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
    }, []);

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

    if (productList.length === 0) {
        return (
            <div className='flex justify-center items-center py-10'>
                <div className='text-gray-600 font-semibold'>No products available</div>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2'>
            {productList.map((product) => (
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