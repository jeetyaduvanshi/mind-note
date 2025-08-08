import React from 'react';

const About = () => {
  // --- Team Member Data ---
  const teamMembers = [
    {
      name: 'Jeet Yaduvanshi',
      role: 'Founder & Lead Strategist',
      bio: 'With over a decade of experience in the tech industry, Jeet Yaduvanshi founded MindNote to bridge the gap between complex technology and clear, compelling content.',
      initials: 'JE',
    },
    {
      name: 'Shoaib Akhtar',
      role: 'Head of Development',
      bio: 'Shoaib is a full-stack wizard who turns innovative ideas into fast, functional, and beautiful web applications. He leads our development team with a passion for clean code.',
      initials: 'Sho',
    },
    {
      name: 'Deepanshu Singh',
      role: 'Creative Director',
      bio: 'Deepanshu has a keen eye for design and user experience, ensuring that every project we deliver is not only powerful but also intuitive and visually stunning.',
      initials: 'D',
    },
  ];

  // Values Data
  const values = [
    {
      title: 'Deep Expertise',
      description: 'Our team lives and breathes technology. We bring a wealth of knowledge to every project, ensuring authentic and accurate results.'
    },
    {
      title: 'Uncompromising Quality',
      description: 'From a single line of code to a full content strategy, we are committed to the highest standards of excellence in everything we do.'
    },
    {
      title: 'Collaborative Partnership',
      description: 'We see ourselves as an extension of your team. Your goals are our goals, and we work collaboratively to achieve them.'
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* --- Header Section --- */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            About Mind<span className='text-orange-500'>Note  </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
            We are a collective of strategists, developers, and creatives passionate about building the future of the web.
          </p>
        </div>

        {/* --- Our Story Section --- */}
        <div className="mt-20 lg:mt-28 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Story</h2>
                <p className="mt-4 text-gray-400 text-lg">
                    MindNote was born from a simple observation: too many brilliant technological ideas were failing to connect with their intended audience. The language was too complex, the websites were clunky, and the content lacked a compelling narrative.
                </p>
                <p className="mt-4 text-gray-400 text-lg">
                    Founded in 2022, we set out to change that. We assembled a team of experts who were not only masters of their craft—be it coding, design, or writing—but who also shared a deep passion for making technology accessible and exciting for everyone. Today, we help businesses of all sizes tell their stories, build amazing products, and grow their digital presence.
                </p>
            </div>
            {/* --- Image placeholder --- */}
            <div className="order-1 md:order-2 h-64 md:h-full w-full bg-gray-800 rounded-xl shadow-2xl flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-500">Our Journey</span>
            </div>
        </div>

        {/* --- Mission and Vision Section --- */}
        <div className="mt-20 lg:mt-28 grid md:grid-cols-2 gap-8 text-center ">
            <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-orange-500">Our Mission</h3>
                <p className="mt-4 text-gray-300">To empower businesses by crafting clear, compelling digital experiences that bridge the gap between innovation and audience engagement.</p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-orange-500 ">Our Vision</h3>
                <p className="mt-4 text-gray-300">To be the leading partner for tech companies in translating their vision into digital reality, fostering a more connected and understandable digital world.</p>
            </div>
        </div>


        {/* --- Meet my Team Section --- */}
        <div className="mt-20 lg:mt-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Meet the Team</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            The passionate minds behind our success.
          </p>
          <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="space-y-4">

                <div className="mx-auto h-40 w-40 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-indigo-300">{member.initials}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-orange-500 font-semibold">{member.role}</p>
                  <p className="text-gray-400 max-w-xs mx-auto">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* --- Why Choose Us Section --- */}
         <div className="mt-20 lg:mt-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Why Choose Us?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
                <div key={value.title} className="bg-gray-950 p-8 rounded-xl shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-orange-500 mb-4">{value.title}</h3>
                    <p className="mt-2 text-gray-400">{value.description}</p>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
