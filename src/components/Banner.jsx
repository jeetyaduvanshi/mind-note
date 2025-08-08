import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaPen } from 'react-icons/fa';
const Banner = () => {
  return (
    <div className='px-4 py-32 bg-black mx-auto'>
      <div className='text-white text-center'>
        <h1 className='text-5xl lg:text-7xl leading-snug font-bold mb-5'>Welcome to Our Blog</h1>
        <p className='text-gray-100 lg:w-3/5 mx-auto mb-8 font-primary'>Start your blog today and join a community of writers and readers who are passionate about sharing their stories and ideas. We offer everything you need to get started, from helpful tips and tutorials.</p>
        <div className='flex justify-center gap-4 flex-wrap'>
          
          <Link
            to="/blogs"
            className='font-medium hover:text-orange-500 inline-flex items-center py-2 px-6 bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-700'
          >
            Explore Blogs <FaArrowRight className='mt-1 ml-2' />
          </Link>
          <Link
            to="/create-post"
            className='font-medium bg-orange-500 hover:bg-orange-600 inline-flex items-center py-2 px-6 rounded-lg transition-all duration-300'
          >
            <FaPen className='mr-2' /> Write Your Story
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Banner