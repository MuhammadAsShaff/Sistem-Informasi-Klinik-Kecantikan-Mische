import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({ onOpenTambah }) => (
  <div className="flex justify-end gap-3 mb-6">
    <div className="relative">
      <input 
        type="text" 
        placeholder="Cari..." 
        className="pl-4 pr-10 py-2 bg-[#F3F4F6] border-none rounded-md text-sm w-64 focus:ring-1 focus:ring-green-500 placeholder:text-gray-400"
      />
    </div>
    <button className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-green-600 transition-colors">
      <Search size={20} />
    </button>
    <button 
      onClick={onOpenTambah}
      className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-green-600 transition-colors shadow-sm"
    >
      <Plus size={20} />
    </button>
  </div>
);

export default SearchBar;
