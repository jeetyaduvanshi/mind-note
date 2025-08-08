import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaDribbble, FaFacebook, FaTwitter, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }

    const handleLogout = async () => {
        await logout();
        setIsProfileDropdownOpen(false);
        navigate('/');
    }

    // navItems
    const navItems = [
        { path: "/", link: "Home" },
        { path: "/services", link: "Services" },
        { path: "/about", link: "About" },
        { path: "/blogs", link: "Blogs" },
        { path: "/contact", link: "Contact" },
    ]

    return (
        <header className='bg-black text-white fixed top-0 left-0 right-0 z-50'>
            <nav className='px-4 py-4 flex justify-between items-center mx-auto max-w-7xl'>
                <a href="/" className='text-xl font-bold text-white'>Mind<span className='text-orange-500'>Note</span></a>

                {/* {navItems for large devices} */}
                <ul className='md:flex gap-12 text-lg hidden '>
                    {
                        navItems.map(({ path, link }) => <li className='text-white' key={path}>
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link-hover ${isActive ? "active" : ""}`
                                }
                                to={path}
                            >
                                {link}
                            </NavLink>
                        </li>)
                    }
                </ul>

                {/* menu icons & auth buttons */}
                <div className='text-white md:flex gap-4 items-center hidden'>
                    {/* Social Icons Wrapper - Hidden on medium, visible on large */}
                    <div className='hidden lg:flex gap-4 items-center'>
                        <a href="/" className='hover:text-blue-600 text-2xl'><FaFacebook /></a>
                        <a href="/" className='hover:text-pink-400 text-2xl'><FaDribbble /></a>
                        <a href="/" className='hover:text-blue-400 text-2xl'><FaTwitter /></a>
                    </div>

                    {isAuthenticated ? (
                        <>
                            {/* Create Post Button */}
                            <NavLink
                                to="/create-post"
                                className='bg-gray-600 px-4 py-2 font-medium rounded hover:bg-orange-500 transition-all duration-200 ease-in'
                            >
                                Write Post
                            </NavLink>

                            {/* Profile Dropdown */}
                            <div className='relative'>
                                <button
                                    onClick={toggleProfileDropdown}
                                    className='flex items-center gap-2 bg-orange-500 px-4 py-2 font-medium rounded hover:bg-orange-600 transition-all duration-200 ease-in'
                                >
                                    <img
                                        src={user?.avatar || 'https://via.placeholder.com/40x40?text=U'}
                                        alt={user?.name}
                                        className='w-6 h-6 rounded-full object-cover'
                                    />
                                    {user?.name}
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50'>
                                        <div className='px-4 py-2 border-b border-gray-200'>
                                            <p className='text-sm font-medium'>{user?.name}</p>
                                            <p className='text-xs text-gray-600'>{user?.email}</p>
                                        </div>
                                        <NavLink
                                            to="/profile"
                                            className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100'
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <FaUser size={14} />
                                            Profile
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className='flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                        >
                                            <FaSignOutAlt size={14} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Login & Register Buttons */}
                            <NavLink
                                to="/login"
                                className='bg-gray-600 px-4 py-2 font-medium rounded hover:bg-gray-700 transition-all duration-200 ease-in'
                            >
                                Log in
                            </NavLink>
                            <NavLink
                                to="/register"
                                className='bg-orange-500 px-4 py-2 font-medium rounded hover:bg-orange-600 transition-all duration-200 ease-in'
                            >
                                Sign up
                            </NavLink>
                        </>
                    )}
                </div>

                {/* mobile menu btn display mobile screen */}
                <div className='md:hidden'>
                    <button onClick={toggleMenu} className='cursor-pointer'>
                        {
                            isMenuOpen ? <FaXmark className='w-5 h-5' /> : <FaBars className='w-5 h-5' />
                        }
                    </button>
                </div>
            </nav>

            {/* menu items only for mobile */}
            <ul className={`md:hidden gap-12 text-lg block space-y-4 px-4 py-6 mt-14 bg-white ${isMenuOpen ? "fixed top-0 left-0 w-full transition-all ease-out duration-150" : "hidden"}`}>
                {navItems.map(({ path, link }) => (
                    <li className='text-black' key={path}>
                        <NavLink onClick={toggleMenu} to={path}>{link}</NavLink>
                    </li>
                ))}

                {isAuthenticated ? (
                    <>
                        {/* Added Create Post button for mobile */}
                        <li className='text-black'>
                            <NavLink
                                onClick={toggleMenu}
                                to="/create-post"
                                className='block w-full bg-gray-600 text-white px-6 py-2 font-medium rounded hover:bg-orange-500 transition-all duration-200 ease-in text-center'
                            >
                                Write Post
                            </NavLink>
                        </li>

                        {/* Profile info for mobile */}
                        <li className='text-black border-t pt-4'>
                            <div className='flex items-center gap-3 mb-3'>
                                <img
                                    src={user?.avatar || 'https://via.placeholder.com/40x40?text=U'}
                                    alt={user?.name}
                                    className='w-8 h-8 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-medium'>{user?.name}</p>
                                    <p className='text-xs text-gray-600'>{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className='w-full bg-red-500 text-white px-6 py-2 font-medium rounded hover:bg-red-600 transition-all duration-200 ease-in'
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        {/* Added Login button for mobile */}
                        <li className='text-black'>
                            <NavLink
                                onClick={toggleMenu}
                                to="/login"
                                className='block w-full bg-gray-600 text-white px-6 py-2 font-medium rounded hover:bg-gray-700 transition-all duration-200 ease-in text-center'
                            >
                                Log in
                            </NavLink>
                        </li>
                        <li className='text-black'>
                            <NavLink
                                onClick={toggleMenu}
                                to="/register"
                                className='block w-full bg-orange-500 text-white px-6 py-2 font-medium rounded hover:bg-orange-600 transition-all duration-200 ease-in text-center'
                            >
                                Sign up
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </header>
    )
}

export default Navbar