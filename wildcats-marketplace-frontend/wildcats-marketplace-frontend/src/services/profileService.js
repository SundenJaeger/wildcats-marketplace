const API_BASE_URL = 'http://localhost:8080/api';

export const profileService = {
    async getProfile() {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error('Failed to fetch profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    async updateProfile(profileData) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
};