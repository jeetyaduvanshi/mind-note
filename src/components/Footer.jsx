import React from 'react'
import { } from 'react-icons'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa6'


const Footer = () => {
return (
<div className='bg-gray-900'>
<div className='px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-4'>
<div className='grid mb-8 lg:grid-cols-5'>
<div className='grid grid-cols-2 gap-5 lg:col-span-4 md:grid-cols-6'>
<div>
<div><p className='font-medium tracking-wide text-gray-300'>Content</p></div>
<ul className='mt-2 space-y-2'>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>News</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>World</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Games</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>References</a>
</li>
</ul>
</div>

{/* Category 2 */}
<div>
<div><p className='font-medium tracking-wide text-gray-300'>Help</p></div>
<ul className='mt-2 space-y-2'>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Support</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>FAQs</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Icon style</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Merchandiding Licence</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Follow</a>
</li>
</ul>
</div>

{/* Category 3 */}
<div>
<div><p className='font-medium tracking-wide text-gray-300'>Company</p></div>
<ul className='mt-2 space-y-2'>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>About</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Contact us</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Our license</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Blog</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Plans and Pricing</a>
</li>
</ul>
</div>

{/* Category 4 */}
<div>
<div><p className='font-medium tracking-wide text-gray-300'>Tools</p></div>
<ul className='mt-2 space-y-2'>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Api</a>
</li>
<li>
<a href="/" className='text-gray-500 transition-colors duration-300
hover:text-orange-500'>Google Workspace</a>
</li>

</ul>
</div>
{/* Subscription */}
<div className='md:max-w-md lg:col-span-2 '>
<p className='font-medium tracking-wide text-gray-300'>Subscribe for updates</p>
<form className='mt-4 flex flex-col md:flex-row'>
<input type="email" placeholder='example@gmail.com' name="email" id="email" className='flex-grow w-full h-12 px-4
mb-3 transition duration-200 bg-white border-gray-300 rounded shadow-sm
aspect-auto md:mr-2 md:mb-0 focus:border-purple-400 focus:outline-none'></input>
<button type='submit' className='inline-flex items-center justify-center h-12 px-6
font-medium tracking-wide text-white transition duration-200 rounded shadow-md
hover:bg-orange-500 focus:outline-none border'>
Subscribe
</button>
</form>
<p className='mt-4 text-sm text-gray-500'>Don't miss out on our latest content. Sign up for our newsletter and get fresh articles delivered to you weekly.</p>
</div>
</div>
</div>

<div className='flex flex-col justify-between pt-5 pb-10 border-t border-gray-800 sm:flex-row'>
<p className='text-sm text-gray-500'>© Copyright 2025 | All reserved.</p>
          <div className='flex items-center mt-4 pb-10 space-x-4 sm:mt-0'>
            <div><div><p className='font-medium tracking-wide text-gray-300 text-2xl'>Social Media</p></div></div>
<a href="" className='text-gray-500 transition-all duration-300
hover:text-orange-500 text-2xl'><FaTwitter/></a>
<a href="" className='text-gray-500 transition-all duration-300
hover:text-orange-500 text-2xl'><FaInstagram/></a>
<a href="" className='text-gray-500 transition-all duration-300
hover:text-orange-500 text-2xl'><FaFacebook/></a>
<a href="" className='text-gray-500 transition-all duration-300
hover:text-orange-500 text-2xl'><FaYoutube/></a>
</div>
</div>

</div>
</div>
)
}

export default Footer