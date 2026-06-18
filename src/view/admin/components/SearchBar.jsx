import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Cari..",
  leftComponents,
  rightComponents
}) {
  return (
    <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-2 mb-6">
      {leftComponents}

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none text-gray-700"
        />
      </div>

      <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer">
        <Search size={20} />
      </button>

      {rightComponents}
    </div>
  );
}
