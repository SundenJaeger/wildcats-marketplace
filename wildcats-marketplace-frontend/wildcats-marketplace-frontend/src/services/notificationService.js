import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

export const notificationService = {
    // Get all notifications for a student
    getNotifications: async (studentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Get unread notifications
    getUnreadNotifications: async (studentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${studentId}/unread`);
            return response.data;
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            throw error;
        }
    },

    // Get unread count
    getUnreadCount: async (studentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/student/${studentId}/unread/count`);
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
    markAllAsRead: async (studentId) => {
        try {
            await axios.put(`${API_BASE_URL}/student/${studentId}/read-all`);
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