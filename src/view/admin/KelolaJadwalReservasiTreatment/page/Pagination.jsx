import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-10">
      <button className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-100 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium">
        <ArrowLeft size={18} /> Previous
      </button>
      
      <div className="bg-[#56BC36] text-white w-10 h-10 flex items-center justify-center rounded-md font-bold text-lg shadow-lg shadow-green-100">
        1
      </div>

      <button className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-100 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium">
        Next <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
