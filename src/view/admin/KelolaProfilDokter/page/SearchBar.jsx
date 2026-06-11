import React from "react";
import { Search, Plus } from "lucide-react";

export default function SearchBar({ value, onChange, onOpenTambah }) {
  return (
    <div className="flex justify-end items-center gap-2 mb-6">
      {/* INPUT SEARCH */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Cari.." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none text-gray-700"
        />
      </div>

      {/* TOMBOL CARI */}
      <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer">
        <Search size={18} />
      </button>

      {/* TOMBOL TAMBAH DOKTER */}
      <button 
        onClick={onOpenTambah}
        className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
