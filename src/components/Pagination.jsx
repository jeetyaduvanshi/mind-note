import React from 'react'

const Pagination = ({ onPageChange, currentPage, totalPages, totalPosts }) => {
    const renderPaginationLinks = () => {
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return pages.map((pageNumber) => (
            <li className={pageNumber === currentPage ? "activerPagination" : ""} key={pageNumber}>
                <button
                    onClick={() => onPageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${pageNumber === currentPage ? 'bg-orange-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                >
                    {pageNumber}
                </button>
            </li>
        ));
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center mt-8">
            <div className="text-sm text-gray-600 mb-4">
                Showing page {currentPage} of {totalPages} ({totalPosts} total posts)
            </div>
            <ul className='pagination my-4 flex-wrap gap-4'>
                <li>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                </li>
                <div className='flex gap-1'>{renderPaginationLinks()}</div>
                <li>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default Pagination