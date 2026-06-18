import React from 'react';
import { Search } from 'lucide-react';
import { usePromoData } from './hooks/usePromoData';
import PromoCard from './page/PromoCard';
import FilterPromo from './page/FilterPromo';
import CustomerLoading from '../components/CustomerLoading';

export default function HalamanPromo() {
  const { 
    promos, 
    searchQuery, 
    setSearchQuery, 
    filterJenis, 
    setFilterJenis, 
    filterStatus, 
    setFilterStatus,
    isLoading
  } = usePromoData();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-10 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Header / Search Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black stroke-[3]" />
            </div>
            <input
              type="text"
              placeholder="Ayo Cari Promo Terbaru Dari Mische..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-13 pr-4 py-3 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-[#56BC36] outline-none text-gray-700 font-medium transition-all"
            />
          </div>

          {/* Filter Component */}
          <FilterPromo 
            selectedJenis={filterJenis}
            setSelectedJenis={setFilterJenis}
            selectedStatus={filterStatus}
            setSelectedStatus={setFilterStatus}
          />
        </div>

        {/* Grid Promo */}
        {isLoading ? (
          <CustomerLoading text="Memuat daftar promo terbaru..." />
        ) : promos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-medium">Tidak ada promo yang ditemukan.</p>
          </div>
        )}

      </div>
    </div>
  );
}
