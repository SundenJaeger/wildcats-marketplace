import axios from 'axios';

// IMPORTANT: Update this URL to match your backend's base URL if different
const API_URL = 'http://localhost:8080/api/reports';

export const reportService = {
    /**
     * Sends a new report to the backend.
     * @param {object} reportData - The data for the report (reason, description, student, resource).
     * @returns {Promise<object>} The created report response object.
     */
    createReport: async (reportData) => {
        try {
            const response = await axios.post(API_URL, reportData);
            return response.data;
        } catch (error) {
            console.error('Error creating report:', error);
            // Re-throw the error to be handled by the caller (ProductPost.jsx)
            throw error;
        }
    }
};