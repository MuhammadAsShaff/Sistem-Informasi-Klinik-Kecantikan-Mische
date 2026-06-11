import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({ onOpenTambah }) => (
  <div className="flex justify-end items-center gap-2 mb-6">
    <div className="relative">
      <input 
        type="text" 
        placeholder="Cari.." 
        className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none text-gray-700"
      />
    </div>
    <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm">
      <Search size={20} />
    </button>
    <button 
      onClick={onOpenTambah}
      className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm"
    >
      <Plus size={20} />
    </button>
  </div>
);

export default SearchBar;
