import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const JadwalPagination = () => {
  return (
    <div className="flex justify-between items-center mt-10">
      <button className="flex items-center gap-2 px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium">
        <ArrowLeft size={20} /> Previous
      </button>
      
      <div className="bg-[#56BC36] text-white w-10 h-10 flex items-center justify-center rounded-md font-bold text-lg">
        1
      </div>

      <button className="flex items-center gap-2 px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium">
        Next <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default JadwalPagination;
