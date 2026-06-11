import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        <ArrowLeft size={16} /> Previous
      </button>
      
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#97E779] text-black font-semibold text-sm shadow-sm">
          1
        </button>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
