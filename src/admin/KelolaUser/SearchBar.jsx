import React from "react";
import { Search, Plus } from "lucide-react";

export default function SearchBar({ onOpenTambah }) {
  return (
    <div className="flex justify-end items-center gap-3 mb-8">
      {/* INPUT SEARCH */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Cari.." 
          className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none"
        />
      </div>

      {/* TOMBOL CARI */}
      <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm">
        <Search size={20} />
      </button>

      {/* TOMBOL TAMBAH USER */}
      <button 
        onClick={onOpenTambah}
        className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
