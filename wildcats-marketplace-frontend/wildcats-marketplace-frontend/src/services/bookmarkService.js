const API_BASE_URL = 'http://localhost:8080/api';

export const bookmarkService = {
    // Get image URL helper
    getImageUrl(imagePath) {
        if (!imagePath) return null;
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }
        return `http://localhost:8080/uploads/${imagePath}`;
    },

    // Get all bookmarks for a student
    async getStudentBookmarks(studentId) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/student/${studentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookmarks');
            }

            const bookmarks = await response.json();

            // For each bookmark, fetch the full resource details with images
            const bookmarksWithDetails = await Promise.all(
                bookmarks.map(async (bookmark) => {
                    try {
                        // Fetch full resource details
                        const resourceResponse = await fetch(`${API_BASE_URL}/resources/${bookmark.resourceId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });

                        if (!resourceResponse.ok) {
                            console.error(`Failed to fetch resource ${bookmark.resourceId}`);
                            return null;
                        }

                        const resource = await resourceResponse.json();

                        // Fetch images for this resource
                        const imagesResponse = await fetch(`${API_BASE_URL}/resource-images/resource/${bookmark.resourceId}`);
                        let imageUrls = [];

                        if (imagesResponse.ok) {
                            const images = await imagesResponse.json();
                            imageUrls = images
                                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                .map(img => this.getImageUrl(img.imagePath))
                                .filter(url => url !== null);
                        }

                        // Get seller name
                        let firstName = 'Unknown';
                        let lastName = '';

                        if (resource.student) {
                            if (resource.student.firstName) {
                                firstName = resource.student.firstName;
                                lastName = resource.student.lastName || '';
                            } else if (resource.student.user) {
                                firstName = resource.student.user.firstName || 'Unknown';
                                lastName = resource.student.user.lastName || '';
                            }
                        }

                        const sellerName = `${firstName} ${lastName}`.trim();

                        return {
                            id: resource.resourceId,
                            bookmarkId: bookmark.bookmarkId,
                            name: resource.title,
                            price: `₱${Number(resource.price).toFixed(2)}`,
                            category: resource.category?.categoryName || 'Uncategorized',
                            seller: sellerName || 'Unknown Seller',
                            description: resource.description || 'No description available',
                            condition: resource.condition,
                            status: resource.status,
                            datePosted: resource.datePosted,
                            dateSaved: bookmark.dateSaved,
                            imageList: imageUrls,
                            sellerId: resource.student?.studentId || 'N/A',
                            comments: []
                        };
                    } catch (error) {
                        console.error(`Error fetching details for bookmark ${bookmark.bookmarkId}:`, error);
                        return null;
                    }
                })
            );

            // Filter out any null results
            return bookmarksWithDetails.filter(bookmark => bookmark !== null);
        } catch (error) {
            console.error('Error fetching student bookmarks:', error);
            throw error;
        }
    },

    // Add a bookmark
    async addBookmark(studentId, resourceId) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/student/${studentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resourceId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add bookmark');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding bookmark:', error);
            throw error;
        }
    },

    // Remove a bookmark
    async removeBookmark(studentId, resourceId) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/student/${studentId}/resource/${resourceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove bookmark');
            }

            return true;
        } catch (error) {
            console.error('Error removing bookmark:', error);
            throw error;
        }
    },

    // Check if a resource is bookmarked
    async isBookmarked(studentId, resourceId) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/student/${studentId}/resource/${resourceId}/exists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                return false;
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking bookmark status:', error);
            return false;
        }
    }
};