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
            return await Promise.all(
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
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        }
    },
// Add these methods to your existing listingService object

    async updateResource(resourceId, resourceData) {
        try {
            console.log('Making PUT request to:', `${API_BASE_URL}/resources/${resourceId}`);
            console.log('Request body:', JSON.stringify(resourceData, null, 2));

            const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Failed to update resource (${response.status}): ${errorText}`);
                }

                throw new Error(errorData.message || `Failed to update resource (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
    },

    async updateResourceStatus(resourceId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    },

    async updateResourceCondition(resourceId, condition) {
        try {
            const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/condition`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ condition })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update condition');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating condition:', error);
            throw error;
        }
    },

    async deleteResource(resourceId) {
        try {
            const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete resource');
            }

            return true;
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    },

    async updatePrimaryImage(resourceId, imageId) {
        try {
            console.log('=== updatePrimaryImage ===');
            console.log('resourceId:', resourceId);
            console.log('imageId to make primary:', imageId);

            // Fetch all images for the resource
            const imagesResponse = await fetch(`${API_BASE_URL}/resource-images/resource/${resourceId}`);
            if (!imagesResponse.ok) {
                throw new Error('Failed to fetch images');
            }

            const images = await imagesResponse.json();
            // Sort by current display order
            images.sort((a, b) => a.displayOrder - b.displayOrder);

            console.log('All images (sorted):', images.map(img => ({ id: img.imageId, order: img.displayOrder, path: img.imagePath })));

            // Find the image we want to make primary
            const targetImage = images.find(img => img.imageId === imageId);
            if (!targetImage) {
                throw new Error('Selected image not found');
            }

            console.log('Target image found:', targetImage);
            console.log('Target current position:', images.indexOf(targetImage));

            // Create new ordering: move target to position 0, shift others
            const reorderedImages = [
                targetImage,
                ...images.filter(img => img.imageId !== imageId)
            ];

            console.log('New order:', reorderedImages.map((img, idx) => ({ id: img.imageId, newOrder: idx })));

            // Update all images with their new display orders
            for (let i = 0; i < reorderedImages.length; i++) {
                const img = reorderedImages[i];

                console.log(`Updating image ${img.imageId}: displayOrder ${img.displayOrder} -> ${i}`);

                const imageData = {
                    resource: {
                        resourceId: resourceId
                    },
                    imagePath: img.imagePath,
                    displayOrder: i
                };

                const response = await fetch(`${API_BASE_URL}/resource-images/${img.imageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imageData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Failed to update image ${img.imageId}:`, errorText);
                    throw new Error(`Failed to update image order: ${errorText}`);
                }
            }

            console.log('Primary image updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating primary image:', error);
            throw error;
        }
    },

    async updateImageOrder(resourceId, primaryIndex) {
        try {
            console.log('Updating image order - resourceId:', resourceId, 'primaryIndex:', primaryIndex);

            // Fetch all images for the resource
            const imagesResponse = await fetch(`${API_BASE_URL}/resource-images/resource/${resourceId}`);
            if (!imagesResponse.ok) {
                throw new Error('Failed to fetch images');
            }

            const images = await imagesResponse.json();
            console.log('Fetched images:', images);

            if (images.length === 0 || primaryIndex >= images.length) {
                console.log('Invalid index or no images');
                return false;
            }

            // Sort images by current display order
            images.sort((a, b) => a.displayOrder - b.displayOrder);

            // Reorder the array - move selected image to front
            const reorderedImages = [
                images[primaryIndex],
                ...images.slice(0, primaryIndex),
                ...images.slice(primaryIndex + 1)
            ];

            console.log('Reordered images:', reorderedImages.map(img => ({ id: img.imageId, order: img.displayOrder })));

            // Update display orders for all images using PUT with correct request format
            for (let i = 0; i < reorderedImages.length; i++) {
                const imageData = {
                    resource: {
                        resourceId: resourceId
                    },
                    imagePath: reorderedImages[i].imagePath,
                    displayOrder: i
                };

                console.log(`Updating image ${reorderedImages[i].imageId} to order ${i}`);

                const response = await fetch(`${API_BASE_URL}/resource-images/${reorderedImages[i].imageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imageData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Failed to update image ${reorderedImages[i].imageId}:`, errorText);
                    throw new Error(`Failed to update image order: ${errorText}`);
                } else {
                    console.log(`Successfully updated image ${reorderedImages[i].imageId}`);
                }
            }

            console.log('All images updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating image order:', error);
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