import React from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, onAdd }) {
  return (
    <div className="flex justify-end items-center gap-2 mb-6">
      <div className="relative bg-[#F3F4F6] rounded-md h-[40px] flex items-center">
        <select className="appearance-none bg-transparent border-none focus:ring-0 text-gray-700 py-0 pl-4 pr-8 text-sm outline-none cursor-pointer h-full">
          <option>All Event</option>
        </select>
        <div className="pointer-events-none absolute right-0 flex items-center pr-2 text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Cari.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none text-gray-700"
        />
      </div>

      <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm">
        <Search size={20} />
      </button>

      <button 
        onClick={onAdd}
        className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm flex items-center justify-center"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
