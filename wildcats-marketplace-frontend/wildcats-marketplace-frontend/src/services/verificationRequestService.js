// src/services/verificationRequestService.js

const API_BASE_URL = 'http://localhost:8080/api/verification-requests';

export const verificationRequestService = {
    // 1. Get all requests
    async getAllRequests() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If you implement JWT later, add it here
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                    adminNotes: adminNotes,
                    rejectionReason: rejectionReason
                })
            });
            if (!response.ok) throw new Error('Failed to update status');
            return await response.json();
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    }
};