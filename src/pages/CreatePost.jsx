import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper function to validate URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

const CreatePost = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        image: '',
        excerpt: '',
        tags: '',
        status: 'published'
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !user) {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    // Show loading while auth state is being determined
    if (!user) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    const categories = [
        'Technology',
        'Lifestyle',
        'Travel',
        'Food',
        'Health',
        'Business',
        'Education',
        'Entertainment',
        'Sports',
        'Fashion',
        'Science',
        'Politics',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check if user is authenticated
        if (!user) {
            setError('You must be logged in to create a post');
            setLoading(false);
            return;
        }

        // Enhanced validation
        if (!formData.title || !formData.content || !formData.category) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        // Check minimum length requirements
        if (formData.title.trim().length < 5) {
            setError('Title must be at least 5 characters long');
            setLoading(false);
            return;
        }

        if (formData.content.trim().length < 10) {
            setError('Content must be at least 10 characters long');
            setLoading(false);
            return;
        }

        // Validate image URL if provided
        if (formData.image.trim() && !isValidUrl(formData.image.trim())) {
            setError('Please provide a valid image URL');
            setLoading(false);
            return;
        }

        try {
            const postData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                excerpt: formData.excerpt.trim() || '',
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                image: formData.image.trim() || undefined, // Don't send empty string, send undefined
                status: formData.status || 'published'
            };

            console.log('User object:', user); // Debug log
            console.log('Auth token:', localStorage.getItem('authToken')); // Debug log
            console.log('Sending post data:', postData); // Debug log

            const response = await postsAPI.createPost(postData);
            console.log('Create post response:', response); // Debug log

            if (response.success) {
                navigate('/blogs');
            } else {
                setError(response.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Create post error:', error);
            console.error('Error details:', error.response || error.message);

            // More detailed error handling
            if (error.message === 'Validation failed') {
                // Try to get more specific validation errors
                setError('Please check all fields and try again. Make sure title is at least 5 characters and content is at least 10 characters.');
            } else if (error.message.includes('token')) {
                setError('Authentication failed. Please log in again.');
            } else if (error.message.includes('validation') || error.message.includes('required')) {
                setError('Please check all required fields and try again.');
            } else {
                setError(error.message || 'Failed to create post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                        Create New Post
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
                        Share your thoughts and ideas with the world
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-950 rounded-xl p-8 shadow-lg">
                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Title * <span className="text-xs text-gray-400">(minimum 5 characters)</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${formData.title.length > 0 && formData.title.length < 5
                                        ? 'border-red-500'
                                        : 'border-gray-700'
                                    }`}
                                placeholder="Enter your blog title"
                                required
                            />
                            {formData.title.length > 0 && formData.title.length < 5 && (
                                <p className="mt-1 text-sm text-red-400">Title must be at least 5 characters</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                                Excerpt (Optional)
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Brief description of your post..."
                                maxLength={300}
                            />
                            <p className="mt-1 text-sm text-gray-400">{formData.excerpt.length}/300 characters</p>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                                Image URL (Optional)
                            </label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${formData.image.length > 0 && !isValidUrl(formData.image)
                                        ? 'border-red-500'
                                        : 'border-gray-700'
                                    }`}
                                placeholder="Enter image URL (optional)"
                            />
                            {formData.image.length > 0 && !isValidUrl(formData.image) && (
                                <p className="mt-1 text-sm text-red-400">Please enter a valid URL</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                                Content * <span className="text-xs text-gray-400">(minimum 10 characters)</span>
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="12"
                                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${formData.content.length > 0 && formData.content.length < 10
                                        ? 'border-red-500'
                                        : 'border-gray-700'
                                    }`}
                                placeholder="Write your blog content here..."
                                required
                            />
                            {formData.content.length > 0 && formData.content.length < 10 && (
                                <p className="mt-1 text-sm text-red-400">Content must be at least 10 characters</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing...
                                </div>
                            ) : (
                                'Publish Post'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/blogs')}
                            disabled={loading}
                            className="flex-1 bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
