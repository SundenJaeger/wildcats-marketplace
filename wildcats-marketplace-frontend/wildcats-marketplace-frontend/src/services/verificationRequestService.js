// src/services/verificationRequestService.js
// const API_BASE_URL = 'http://localhost:8080/api/verification-requests';
const API_BASE_URL = 'http://localhost:8000/verification-requests';


//helper functions
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
        return { 'Content-Type': 'application/json' };
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };
};

export const verificationRequestService = {
    // 1. Get all requests
    async getAllRequests(status = null) {
        try {
            let url = API_BASE_URL;
            if (status && status !== 'All Requests') {
                url += `?status=${status.toLowerCase()}`; // pending, approved, rejected
            }

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch requests');
            return await response.json();
        } catch (error) {
            console.error('Error fetching verification requests:', error);
            throw error;
        }
    },

    // 2. Update status (Approve/Reject)
    async updateStatus(id, status, adminNotes, rejectionReason = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    status,
                    adminNotes,
                    rejectionReason
                })
            });
            if (!response.ok) throw new Error('Failed to update status');
            return await response.json();
        } catch (error) {
            console.error('Error updating status:', error);
            throw error; // Rethrow to be caught by the React component
        }
    }
};