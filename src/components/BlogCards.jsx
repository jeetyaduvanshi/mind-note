import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogCards = ({ blogs, onBlogUpdate }) => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLike = async (e, blogId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please login to like posts');
            return;
        }

        try {
            setLoading(true);
            await postsAPI.toggleLike(blogId);
            // Refresh the blog list to get updated like status
            if (onBlogUpdate) {
                onBlogUpdate();
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to update like status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async (e, blogId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please login to bookmark posts');
            return;
        }

        try {
            setLoading(true);
            await postsAPI.toggleBookmark(blogId);
            // Refresh the blog list to get updated bookmark status
            if (onBlogUpdate) {
                onBlogUpdate();
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            alert('Failed to update bookmark status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 content-start'>
            {blogs.map((blog) => {
                const isLikedByUser = blog.isLiked || false;
                const isBookmarkedByUser = blog.isBookmarked || false;
                const blogId = blog._id || blog.id;

                return (
                    <Link
                        to={`/blogs/${blogId}`}
                        key={blogId}
                        className='p-5 shadow-lg rounded-2xl flex flex-col bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow duration-300 h-full'
                    >
                        <div>
                            <img src={blog.image} alt={blog.title} className='w-full h-48 object-cover rounded-lg' />
                        </div>

                        <div className='flex-grow py-4'>
                            <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-2">
                                {blog.category}
                            </span>
                            <h3 className='mb-2 font-bold hover:text-blue-600 transition-colors duration-300'>
                                {blog.title}
                            </h3>
                            <Link
                                to={`/author/${blog.author?.name || blog.author}`}
                                className='text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaUser className='inline-flex items-center mr-2' />
                                {blog.author?.name || blog.author}
                            </Link>
                        </div>

                        <div className='flex justify-between items-center mt-auto pt-4 border-t-2 border-gray-100 dark:border-gray-800'>
                            <p className='text-sm text-gray-500'>
                                Published: {blog.published_date || new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                            <div className='flex items-center space-x-4'>
                                <button
                                    onClick={(e) => handleLike(e, blogId)}
                                    disabled={loading}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-300 disabled:opacity-50"
                                >
                                    {isLikedByUser ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                    <span className='text-sm'>{blog.likesCount || blog.likes || 0}</span>
                                </button>
                                <button
                                    onClick={(e) => handleBookmark(e, blogId)}
                                    disabled={loading}
                                    className="text-gray-500 hover:text-blue-500 transition-colors duration-300 disabled:opacity-50"
                                >
                                    {isBookmarkedByUser ? <FaBookmark className="text-blue-500" /> : <FaRegBookmark />}
                                </button>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
};

export default BlogCards;
