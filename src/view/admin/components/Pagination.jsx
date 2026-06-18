import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 0) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-400 text-gray-900 hover:bg-gray-100 bg-white cursor-pointer'}`}
      >
        <ArrowLeft size={16} /> Previous
      </button>

      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm shadow-sm font-semibold transition-colors ${isActive ? 'bg-[#97E779] text-black' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-400 text-gray-900 hover:bg-gray-100 bg-white cursor-pointer'}`}
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
