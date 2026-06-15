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
        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm ${
          currentPage === 1 
            ? "text-gray-500 bg-gray-100 border-gray-300 cursor-default" 
            : "text-gray-900 border-gray-400 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* ANGKA HALAMAN */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 mr-2">Halaman</span>
        <div className="flex items-center justify-center bg-[#97E779] text-black w-8 h-8 rounded font-semibold text-sm shadow-sm">
          {currentPage}
        </div>
        <span className="text-sm font-medium text-gray-500 ml-2">dari {lastPage}</span>
      </div>

      {/* BERIKUTNYA */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm ${
          currentPage === lastPage 
            ? "text-gray-500 bg-gray-100 border-gray-300 cursor-default" 
            : "text-gray-900 border-gray-400 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
