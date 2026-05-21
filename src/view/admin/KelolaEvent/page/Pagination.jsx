import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        <ArrowLeft size={16} />
        Previous
      </button>
      
      <div className="flex items-center">
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#97E779] text-black font-semibold text-sm">
          1
        </button>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
