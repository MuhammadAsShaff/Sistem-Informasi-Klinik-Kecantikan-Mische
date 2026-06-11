import React from 'react';

const CategoryTabs = ({ activeCategory, setActiveCategory, categories = [] }) => {
  const allCategories = [
    { id: 'semua', label: 'SEMUA PRODUK' },
    ...categories.map(cat => ({
      id: cat.idKategori?.toString() || cat.id?.toString(),
      label: cat.nama ? cat.nama.toUpperCase() : 'UNKNOWN'
    }))
  ];

  return (
    <div className="w-full flex justify-center py-6 px-4 overflow-x-auto no-scrollbar">
      <div className="flex space-x-6 md:space-x-12 min-w-max">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`pb-2 text-sm md:text-base font-medium transition-colors relative whitespace-nowrap
              ${activeCategory === category.id ? 'text-green-700' : 'text-gray-500 hover:text-green-600'}
            `}
          >
            {category.label}
            {/* Active underline */}
            <span 
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300
                ${activeCategory === category.id ? 'scale-x-100' : 'scale-x-0'}
              `}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
