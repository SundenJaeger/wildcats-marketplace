import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/notifications';

export const notificationService = {
    // Get all notifications for a student
    getNotifications: async (student_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${student_id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Get unread notifications
    getUnreadNotifications: async (student_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${student_id}/unread`);
            return response.data;
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            throw error;
        }
    },

    // Get unread count
    getUnreadCount: async (student_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${student_id}/unread/count`);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            await axios.put(`${API_BASE_URL}/${notificationId}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    markAllAsRead: async (student_id) => {
        try {
            await axios.put(`${API_BASE_URL}/student/${student_id}/read-all`);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${notificationId}`);
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
};