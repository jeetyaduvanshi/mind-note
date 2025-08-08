import React from 'react';

const Services = () => {
  const servicesData = [
    {
      title: 'Content & Strategy',
      description: 'In today\'s market, high-quality content builds trust, drives traffic, and establishes you as a leader. We create content that is not only engaging but also technically accurate.',
      items: [
        'Technical Blog Writing',
        'SEO Content Strategy',
        'Website & UX Copywriting',
        'Whitepapers & Case Studies',
      ],
    },
    {
      title: 'Web Design & Development',
      description: 'Your website is your most important digital asset. We design fast, responsive, and intuitive websites that provide an exceptional user experience using modern technologies.',
      items: [
        'Custom Website Development',
        'UI/UX Design',
        'Website Maintenance & Support',
        'Performance Optimization',
      ],
    },
  ];

  // --- Data for Process ---
  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We start by understanding your business, your audience, and your goals to create a tailored strategy.',
    },
    {
      step: '02',
      title: 'Design & Execution',
      description: 'Our team gets to work designing and developing your project, with regular check-ins to ensure alignment.',
    },
    {
      step: '03',
      title: 'Review & Refine',
      description: 'We collaborate with you to gather feedback and make iterative improvements until it\'s perfect.',
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'We handle the launch process and provide ongoing support to ensure your success.',
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* --- Header Section --- */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Our Services
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
            At MindNote, we do more than just write about the digital world – we actively build it. We offer a suite of services to help your business thrive in the digital landscape.
          </p>
        </div>

        {/* --- Services Grid Section --- */}
        <div className="mt-20 grid gap-10 sm:grid-cols-1 md:grid-cols-2">
          {servicesData.map((service, index) => (
            <div key={index} className="bg-gray-950 rounded-xl p-8 shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="mt-4 text-gray-400">{service.description}</p>
              <ul className="mt-6 space-y-4 list-disc list-inside">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Our Process Section --- */}
        <div className="mt-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Our Process</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            We follow a proven, collaborative process to ensure high-quality results every time.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-left">
            {processSteps.map((step) => (
               <div key={step.step} className="p-6 bg-gray-950 rounded-lg shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
                 <div className="text-3xl font-bold text-orange-500">{step.step}</div>
                 <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                 <p className="mt-2 text-gray-400">{step.description}</p>
               </div>
            ))}
          </div>
        </div>
        
        {/* Ready Projects*/}
        <div className="mt-28 text-center bg-gray-950 rounded-2xl p-10 sm:p-16 shadow-lg shadow-white hover:shadow-orange-500 transition-shadow duration-300">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to start a project?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Let's talk about how we can help you achieve your goals. Get in touch for a free, no-obligation consultation.
          </p>
          <div className="mt-8">
            <a
              href="/contact" 
              className="inline-block bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-orange-500 transition-colors duration-300 text-lg"
            >
              Get a Free Quote
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
