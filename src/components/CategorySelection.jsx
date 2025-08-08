import React from 'react'

const CategorySelection = ({onSelectCategory, activeCategory}) => {
    const categories = ["Health", "Fintech", "Startups", "AI", "Security", "Enterprise", "Growth", "Apps", "Work", "Gadgets", "Tech"];

    return (
        <div className='px-4 mb-8 lg:space-x-8 flex flex-wrap items-center border-b-2 py-5 text-gray-900 font-semibold gap-4 dark:text-white dark:border-gray-700'>
            <button
                onClick={() => onSelectCategory(null)}
                className={`mr-2 relative pb-1 transition-all duration-0 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange-500
                    after:scale-x-0 hover:after:scale-x-100 after:bg-origin-content after:transition-transform 
                     ${activeCategory ? "" : 'active-button'}`}
            >
                All
            </button>

            {categories.map((category) =>(
                <button 
                    onClick={() => onSelectCategory(category)}
                    className={`mr-2 relative pb-1 transition-all duration-0 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange-500
                    after:scale-x-0 hover:after:scale-x-100 after:bg-origin-content after:transition-transform 
                         
                        ${activeCategory === category ? "active-button" : ""}`} 
                    key={category}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}

export default CategorySelection;
