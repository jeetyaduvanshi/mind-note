const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        // If validation errors are present, include them in the error
        if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
            throw new Error(`${data.message || 'Validation failed'}: ${errorMessages}`);
        }
        throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(userData),
        });

        const data = await handleResponse(response);

        // Store token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(credentials),
        });

        const data = await handleResponse(response);

        // Store token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    logout: async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: createHeaders(true),
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API call success
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify(profileData),
        });

        const data = await handleResponse(response);

        // Update stored user data
        if (data.data?.user) {
            localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        return data;
    },

    changePassword: async (passwordData) => {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify(passwordData),
        });

        return await handleResponse(response);
    },

    getUserById: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            headers: createHeaders(),
        });

        return await handleResponse(response);
    },

    toggleFollow: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/follow`, {
            method: 'PUT',
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },
};

// Posts API
export const postsAPI = {
    getPosts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/posts${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders(true), // Include auth for user-specific data
        });

        return await handleResponse(response);
    },

    getPost: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            headers: createHeaders(true), // Include auth for user-specific data
        });

        return await handleResponse(response);
    },

    createPost: async (postData) => {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(postData),
        });

        return await handleResponse(response);
    },

    updatePost: async (postId, postData) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify(postData),
        });

        return await handleResponse(response);
    },

    deletePost: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    toggleLike: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: 'PUT',
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    toggleBookmark: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/bookmark`, {
            method: 'PUT',
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    addComment: async (postId, comment) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify({ content: comment }),
        });

        return await handleResponse(response);
    },

    deleteComment: async (postId, commentId) => {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    getMyPosts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/posts/user/my-posts${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    getLikedPosts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/posts/user/liked${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },

    getBookmarkedPosts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/posts/user/bookmarked${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders(true),
        });

        return await handleResponse(response);
    },
};

// Auth helpers
export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};
