import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as postsAPI from '../services/api';

const AuthorProfile = () => {
    const { authorName } = useParams();
    const { user } = useAuth();
    const [authorPosts, setAuthorPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const authorDetails = {
        name: authorName,
        bio: `${authorName} is a passionate writer and developer who loves sharing knowledge about technology, programming, and digital innovation. With years of experience in the field, they bring unique insights and practical expertise to every article.`,
        postsCount: 0,
        joinDate: 'January 2023'
    };

    useEffect(() => {
        fetchAuthorPosts();
    }, [authorName]);

    const fetchAuthorPosts = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch posts with author filter
            const response = await postsAPI.getPosts(1, 100, 'all', '', authorName);

            if (response.success) {
                setAuthorPosts(response.data.posts || []);
                authorDetails.postsCount = response.data.posts?.length || 0;
            } else {
                setError('Failed to fetch author posts');
            }
        } catch (err) {
            console.error('Error fetching author posts:', err);
            setError('Error loading author posts');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (e, blogId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setError('Please login to like posts');
            return;
        }

        try {
            const response = await postsAPI.toggleLike(blogId);
            // API returns { success, message, data: { isLiked, likesCount } }
            if (response?.data) {
                setAuthorPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === blogId ? { ...post, isLiked: response.data.isLiked, likesCount: response.data.likesCount } : post
                    )
                );
            } else {
                setError(response?.message || 'Failed to update like');
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            setError('Error updating like');
        }
    };

    const handleBookmark = async (e, blogId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setError('Please login to bookmark posts');
            return;
        }

        try {
            const response = await postsAPI.toggleBookmark(blogId);
            // API returns { success, message, data: { isBookmarked, bookmarksCount } }
            if (response?.data) {
                setAuthorPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === blogId ? { ...post, isBookmarked: response.data.isBookmarked, bookmarksCount: response.data.bookmarksCount } : post
                    )
                );
            } else {
                setError(response?.message || 'Failed to update bookmark');
            }
        } catch (err) {
            console.error('Error toggling bookmark:', err);
            setError('Error updating bookmark');
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="mb-8">
                    <Link
                        to="/blogs"
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Blogs
                    </Link>
                </div>

                <div className="bg-gray-950 rounded-xl p-8 shadow-lg mb-12">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                            <FaUser className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{authorDetails.name}</h1>
                            <p className="text-gray-400">Member since {authorDetails.joinDate}</p>
                            <p className="text-gray-400">{authorDetails.postsCount} posts published</p>
                        </div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{authorDetails.bio}</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-6">Posts by {authorDetails.name}</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        <p className="text-gray-400 mt-4">Loading posts...</p>
                    </div>
                ) : authorPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-xl mb-4">No posts found</div>
                        <p className="text-gray-500">This author hasn't published any posts yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {authorPosts.map((blog) => (
                            <Link
                                to={`/blogs/${blog._id}`}
                                key={blog._id}
                                className="bg-gray-950 rounded-xl p-6 shadow-lg hover:shadow-orange-500 transition-shadow duration-300 flex flex-col"
                            >
                                <div className="mb-4">
                                    <img
                                        src={blog.image || '/api/placeholder/400/200'}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/400/200';
                                        }}
                                    />
                                </div>

                                <div className="flex-grow">
                                    <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-3">
                                        {blog.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-3 hover:text-orange-500 transition-colors duration-300">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3">
                                        {blog.excerpt || blog.content?.substring(0, 120) + '...'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
                                    <span className="text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={(e) => handleLike(e, blog._id)}
                                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-300"
                                        >
                                            {user && blog.likedBy?.includes(user.id) ?
                                                <FaHeart className="text-red-500" /> :
                                                <FaRegHeart />
                                            }
                                            <span className="text-sm">{blog.likes || 0}</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleBookmark(e, blog._id)}
                                            className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
                                        >
                                            {user && blog.bookmarkedBy?.includes(user.id) ?
                                                <FaBookmark className="text-blue-500" /> :
                                                <FaRegBookmark />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
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

export default AuthorProfile;
