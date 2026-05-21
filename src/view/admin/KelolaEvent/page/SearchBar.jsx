import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, onAdd }) {
  return (
    <div className="flex justify-end mb-6">
      <div className="flex items-center gap-0">
        <select className="bg-gray-200 text-gray-700 text-sm px-4 py-2 outline-none border-none cursor-pointer">
          <option>All Event</option>
        </select>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search Event"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 text-sm px-4 py-2 w-[250px] outline-none border-none placeholder-gray-500"
          />
        </div>
        
        <button className="bg-[#56BC36] text-white p-2 hover:bg-[#45a025] transition-colors">
          <Search size={20} />
        </button>

        <button 
          onClick={onAdd}
          className="bg-[#56BC36] text-white p-2 ml-2 hover:bg-[#45a025] transition-colors flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
