import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="mt-10 flex items-center justify-between">
      {/* SEBELUMNYA */}
      <button className="flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
        <ChevronLeft size={24} />
        Previous
      </button>

      {/* ANGKA HALAMAN (AKTIF: HIJAU) */}
      <div className="flex items-center justify-center bg-[#7CC052] text-white w-10 h-10 rounded-lg font-black shadow-md shadow-green-100">
        1
      </div>

      {/* BERIKUTNYA */}
      <button className="flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
        Next
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
