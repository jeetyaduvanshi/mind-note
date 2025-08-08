import React, { useEffect, useState } from 'react'
import BlogCards from './BlogCards';
import Pagination from './Pagination';
import CategorySelection from './CategorySelection';
import Sidebar from './SideBar';
import { postsAPI } from '../services/api';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 12
  const [selectCategory, setSelectCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (selectCategory) {
        params.category = selectCategory;
      }

      const response = await postsAPI.getPosts(params);
      setBlogs(response.data.posts || []);

      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotalPosts(response.data.pagination.totalPosts);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs. Please try again.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleCategoryChange = (category) => {
    setSelectCategory(category);
    setCurrentPage(1);
    setActiveCategory(category);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchBlogs}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* category section  */}
      <div>
        <CategorySelection onSelectCategory={handleCategoryChange} selectCategory={selectCategory}
          activeCategory={activeCategory} />
      </div>

      {/* blogCards Section */}
      <div className='flex-col lg:flex-row gap-12 flex'>
        <BlogCards
          blogs={blogs}
          currentPage={currentPage}
          selectCategory={selectCategory}
          pageSize={pageSize}
          onBlogUpdate={fetchBlogs}
        />

        {/* SideBar Component */}
        <div>
          <Sidebar />
        </div>
      </div>

      {/*  pagination Section */}
      <div>
        <Pagination
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
        />
      </div>
    </div>
  )
}

export default BlogPage