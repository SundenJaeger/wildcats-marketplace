import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

export const commentService = {
    addComment: async (studentId, resourceId, commentText, parentCommentId = null) => {
        const response = await axios.post(`${API_URL}/${studentId}`, {
            resourceId,
            commentText,
            parentCommentId
        });
        return response.data;
    },

    getCommentsByResource: async (resourceId) => {
        const response = await axios.get(`${API_URL}/resource/${resourceId}`);
        return response.data;
    }
};