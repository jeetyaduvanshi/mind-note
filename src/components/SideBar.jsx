import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const Sidebar = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [popularRes, latestRes] = await Promise.all([
          postsAPI.getPosts({ limit: 10, sort: 'popular' }),
          postsAPI.getPosts({ limit: 10, sort: 'newest' })
        ]);
        setPopularBlogs(popularRes?.data?.posts || popularRes?.posts || []);
        setLatestBlogs(latestRes?.data?.posts || latestRes?.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPopularBlogs([]);
        setLatestBlogs([]);
      }
    };

    fetchPosts();
  }, [])


  return (
    <div>
      <div>
        <h3 className='text-2xl font-semibold px-4'>Latest Blogs</h3>
        <div>
          {latestBlogs.slice(0, 5).map(blog => (
            <div key={blog._id} className='my-5 border-b-2 border-spacing-2 px-4 '>
              <h4 className='font-medium mb-2'>{blog.title}</h4>
              <Link to={`/blogs/${blog._id}`} className='text-base pb-2 hover:text-orange-500 inline-flex items-center py-1'>Read more <FaArrowRight className='mt-1 ml-2' /></Link>
            </div>
          ))}
        </div>
      </div>
      {/* Popular Blogs */}

      <div>
        <h3 className='text-2xl font-semibold px-4 mt-20'>Popular Blogs</h3>
        <div>
          {popularBlogs.slice(0, 5).map(blog => (
            <div key={blog._id} className='my-5 border-b-2 border-spacing-2 px-4 '>
              <h4 className='font-medium mb-2'>{blog.title}</h4>
              <Link to={`/blogs/${blog._id}`} className='text-base pb-2 hover:text-orange-500 inline-flex items-center py-1'>Read more <FaArrowRight className='mt-1 ml-2' /></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar