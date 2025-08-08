import React, { useState } from 'react';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); // Prevents the page from reloading on form submission
        console.log("Login attempt with:", { email, password });
    };

  return (
        <div className="bg-gray-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* --- Header Section --- */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Member Login
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
            Have a question, a project idea, or just want to say hello? Fill out the form below and we'll get back to you.
          </p>
        </div>
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className='text-xl font-semibold mb-4 mt-6 text-center text-orange-500'>Please Login Here!</h2>
                  <form className='px-4' onSubmit={handleLogin}>
                      {/* email */}
                      <div className='mb-5'>
                      <input 
                        type='email' 
                        name='email' 
                        id='email' 
                        placeholder='example@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full rounded-md border border-gray-700 bg-gray-800 py-3 px-6 text-base 
                        font-medium text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500'/>
                      </div>
                      {/* Passoword */}
                      <div className='mb-5'>
                      <input 
                        type='password' 
                        name='password' 
                        id='password' 
                        placeholder='Enter your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full rounded-md border border-gray-700 bg-gray-800 py-3 px-6 text-base
                        font-medium text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500'/>
                      </div>
                      <div>
                          <button 
                            type="submit"
                            className='w-full hover:shadow-md rounded-md bg-white hover:bg-orange-500 py-3 
                          px-8 text-base font-semibold text-black outline-none transition-colors duration-300'>
                            Login
                          </button>
                      </div>
                  </form>
        </div>
        </div>
        </div>
  )
}

export default Contact;
