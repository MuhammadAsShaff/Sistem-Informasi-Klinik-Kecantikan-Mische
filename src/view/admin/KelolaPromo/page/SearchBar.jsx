import React from "react";
import { Plus, Search, Filter } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, onAddClick }) {
  return (
    <div className="flex justify-end mb-6">
      <div className="flex gap-2">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 flex items-center gap-2 hover:bg-gray-300 transition-colors text-sm font-medium">
          All Promo <Filter size={16} />
        </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search Promo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 bg-gray-100 border-none w-[300px] focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <button className="bg-[#56BC36] text-white p-2 hover:bg-[#4ea830] transition-colors">
          <Search size={20} />
        </button>

        <button
          onClick={onAddClick}
          className="bg-[#56BC36] text-white p-2 hover:bg-[#4ea830] transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
