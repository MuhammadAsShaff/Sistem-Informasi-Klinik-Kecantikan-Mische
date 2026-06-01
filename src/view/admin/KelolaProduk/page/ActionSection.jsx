import React from 'react';
import { Search, Plus } from 'lucide-react';

const ActionSection = ({ searchQuery, setSearchQuery, onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
      <div className="flex shadow-sm rounded overflow-hidden border border-gray-200 bg-white">
        <input
          type="text"
          placeholder="Cari..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border-none outline-none focus:ring-0 focus:outline-none w-48 text-sm bg-transparent"
        />
        <button className="bg-[#56BC36] hover:bg-[#2da509] text-white p-2.5 flex items-center justify-center transition-colors">
          <Search size={18} />
        </button>
      </div>
      <button 
        onClick={onAddClick}
        className="bg-[#56BC36] hover-[#2da509] text-white p-2.5 rounded shadow-sm flex items-center justify-center transition-colors"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default ActionSection;
