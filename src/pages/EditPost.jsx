import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchPost();
    }, [id, isAuthenticated, navigate]);

    const fetchPost = async () => {
        try {
            setInitialLoading(true);
            setError('');
            const response = await postsAPI.getPost(id);
            const post = response.data.post;

            // Check if user can edit this post
            if (post.author._id !== user._id && user.role !== 'admin') {
                setError('You are not authorized to edit this post');
                setTimeout(() => navigate('/blogs'), 2000);
                return;
            }

            setFormData({
                title: post.title || '',
                content: post.content || '',
                category: post.category || '',
                image: post.image || '',
                excerpt: post.excerpt || '',
                tags: post.tags ? post.tags.join(', ') : '',
                status: post.status || 'published'
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Post not found or you are not authorized to edit it');
            setTimeout(() => navigate('/blogs'), 2000);
        } finally {
            setInitialLoading(false);
        }
    };

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

        if (!formData.title || !formData.content || !formData.category) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const postData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            await postsAPI.updatePost(id, postData);
            navigate(`/blogs/${id}`);
        } catch (error) {
            console.error('Error updating post:', error);
            setError(error.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                        Edit Post
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
                        Update your blog post
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-950 rounded-xl p-8 shadow-lg">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter your blog title"
                                required
                            />
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
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                                Featured Image URL (Optional)
                            </label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
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
                                rows="3"
                                maxLength="300"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                placeholder="Brief description of your post..."
                            />
                            <div className="text-sm text-gray-400 mt-1">
                                {formData.excerpt.length}/300 characters
                            </div>
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
                                placeholder="react, javascript, web development (comma-separated)"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="12"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                placeholder="Write your blog content here..."
                                required
                            />
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
                                    Updating...
                                </div>
                            ) : (
                                'Update Post'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/blogs/${id}`)}
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

export default EditPost;
