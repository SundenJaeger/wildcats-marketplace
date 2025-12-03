const API_BASE_URL = 'http://localhost:8080/api';

export const listingService = {
    // Get all categories
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

    // Upload images for a listing
    async uploadImages(resourceId, images) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            // Upload each image
            const uploadPromises = images.map(async (image, index) => {
                const imageData = {
                    resource: { resourceId: resourceId },
                    imagePath: image.url, // base64 string or URL
                    displayOrder: index,
                    isPrimary: index === 0
                };

                const response = await fetch(`${API_BASE_URL}/resource-images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imageData)
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload image ${index + 1}`);
                }

                return await response.json();
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    // Get user's listings
    async getUserListings(studentId) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
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

            return await response.json();
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        }
    }
};