const API_BASE_URL = 'http://localhost:8080/api';

export const listingService = {
    getImageUrl(imagePath) {
        if (!imagePath) return null;

        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }

        return `http://localhost:8080/uploads/${imagePath}`;
    },


    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get active categories only
    async getActiveCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/active`);
            if (!response.ok) {
                throw new Error('Failed to fetch active categories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching active categories:', error);
            throw error;
        }
    },

    // Create a new resource/listing
    async createListing(listingData) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/resources`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listingData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create listing');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating listing:', error);
            throw error;
        }
    },

    async uploadImages(resourceId, images) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            // Upload each image
            const uploadPromises = images.map(async (image, index) => {
                let fileName;

                // Check if we have a base64 image or a file
                if (image.url.startsWith('data:')) {
                    // Convert base64 to file and upload
                    const formData = new FormData();
                    const blob = dataURLtoBlob(image.url);
                    const file = new File([blob], `image_${index}.jpg`, {type: 'image/jpeg'});
                    formData.append('file', file);

                    // Upload file to server
                    const uploadResponse = await fetch(`${API_BASE_URL}/uploads/image`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Failed to upload image file ${index + 1}`);
                    }

                    fileName = await uploadResponse.text();
                } else if (image.file) {
                    // We have a File object
                    const formData = new FormData();
                    formData.append('file', image.file);

                    const uploadResponse = await fetch(`${API_BASE_URL}/uploads/image`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Failed to upload image file ${index + 1}`);
                    }

                    fileName = await uploadResponse.text();
                } else {
                    throw new Error('Invalid image format');
                }

                // Save image reference to database
                const imageData = {
                    resource: {resourceId: resourceId},
                    imagePath: fileName,
                    displayOrder: index
                };

                const saveResponse = await fetch(`${API_BASE_URL}/resource-images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imageData)
                });

                if (!saveResponse.ok) {
                    throw new Error(`Failed to save image reference ${index + 1}`);
                }

                return await saveResponse.json();
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    async getUserListingsWithImages(studentId) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            // First get the listings
            const response = await fetch(`${API_BASE_URL}/resources/student/${studentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user listings');
            }

            const listings = await response.json();

            // For each listing, fetch its images
            const listingsWithImages = await Promise.all(
                listings.map(async (listing) => {
                    try {
                        // Fetch images for this listing
                        const imagesResponse = await fetch(`${API_BASE_URL}/resource-images/resource/${listing.resourceId}`);
                        if (imagesResponse.ok) {
                            const images = await imagesResponse.json();

                            // Convert image paths to full URLs
                            const imagesWithUrls = images.map(img => ({
                                ...img,
                                fullUrl: this.getImageUrl(img.imagePath)
                            }));

                            return {
                                ...listing,
                                images: imagesWithUrls,
                                primaryImage: imagesWithUrls.length > 0 ? imagesWithUrls[0].fullUrl : null
                            };
                        }
                        return {...listing, images: [], primaryImage: null};
                    } catch (error) {
                        console.error(`Error fetching images for listing ${listing.resourceId}:`, error);
                        return {...listing, images: [], primaryImage: null};
                    }
                })
            );

            return listingsWithImages;
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        }
    },
};

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
}