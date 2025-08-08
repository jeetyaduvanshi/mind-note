import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await postsAPI.getPost(id);
            setBlog(response.data.post);
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Blog not found');
            // Navigate back after a delay if blog not found
            setTimeout(() => navigate('/blogs'), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!blog || !isAuthenticated) {
            alert('Please login to like posts');
            return;
        }

        try {
            setActionLoading(true);
            const response = await postsAPI.toggleLike(blog._id);

            // Update the blog state with new like status
            setBlog(prev => ({
                ...prev,
                isLiked: response.data.isLiked,
                likesCount: response.data.likesCount
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to update like status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!blog || !isAuthenticated) {
            alert('Please login to bookmark posts');
            return;
        }

        try {
            setActionLoading(true);
            const response = await postsAPI.toggleBookmark(blog._id);

            // Update the blog state with new bookmark status
            setBlog(prev => ({
                ...prev,
                isBookmarked: response.data.isBookmarked,
                bookmarksCount: response.data.bookmarksCount
            }));
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            alert('Failed to update bookmark status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!blog || !isAuthenticated) return;

        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                setActionLoading(true);
                await postsAPI.deletePost(blog._id);
                navigate('/blogs');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Please try again.');
            } finally {
                setActionLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error || 'Blog not found'}</div>
                    <Link
                        to="/blogs"
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    const canEdit = isAuthenticated && user && (user._id === blog.author?._id || user.role === 'admin');

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/blogs')}
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Blogs
                    </button>
                </div>

                <article className="bg-gray-950 rounded-xl p-8 shadow-lg">
                    <div className="mb-8">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-80 object-cover rounded-lg"
                        />
                    </div>

                    <div className="mb-6">
                        <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                            {blog.category}
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {blog.title}
                        </h1>
                    </div>

                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                        <div className="flex items-center space-x-4">
                            <Link
                                to={`/author/${blog.author?.name || blog.author}`}
                                className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <FaUser className="mr-2" />
                                {blog.author?.name || blog.author}
                            </Link>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                disabled={actionLoading}
                                className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-300 disabled:opacity-50"
                            >
                                {blog.isLiked ?
                                    <FaHeart className="text-red-500" /> :
                                    <FaRegHeart />
                                }
                                <span>{blog.likesCount || 0}</span>
                            </button>

                            <button
                                onClick={handleBookmark}
                                disabled={actionLoading}
                                className="text-gray-400 hover:text-blue-500 transition-colors duration-300 disabled:opacity-50"
                            >
                                {blog.isBookmarked ?
                                    <FaBookmark className="text-blue-500" /> :
                                    <FaRegBookmark />
                                }
                            </button>

                            {canEdit && (
                                <>
                                    <Link
                                        to={`/edit-post/${blog._id}`}
                                        className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                                    >
                                        <FaEdit />
                                    </Link>

                                    <button
                                        onClick={handleDelete}
                                        disabled={actionLoading}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-300 disabled:opacity-50"
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                            {blog.content}
                        </div>
                    </div>
                </article>

                <div className="mt-12 text-center">
                    <Link
                        to="/create-post"
                        className="inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors duration-300"
                    >
                        Write Your Own Post
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
