import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  // Cegah render jika tidak ada halaman
  if (lastPage <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-between animate-in fade-in duration-500">
      {/* SEBELUMNYA */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-xl font-bold transition-all shadow-sm ${
          currentPage === 1 
            ? "text-gray-400 bg-gray-50 cursor-not-allowed" 
            : "text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <ChevronLeft size={24} />
        Previous
      </button>

      {/* ANGKA HALAMAN */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 mr-2">Halaman</span>
        <div className="flex items-center justify-center bg-[#7CC052] text-white w-10 h-10 rounded-lg font-black shadow-md shadow-green-100">
          {currentPage}
        </div>
        <span className="text-sm font-medium text-gray-500 ml-2">dari {lastPage}</span>
      </div>

      {/* BERIKUTNYA */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-xl font-bold transition-all shadow-sm ${
          currentPage === lastPage 
            ? "text-gray-400 bg-gray-50 cursor-not-allowed" 
            : "text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        Next
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
