import React from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { useFilterPromo } from '../hooks/useFilterPromo';

/**
 * =========================================================================
 * LACI TOMBOL SARINGAN PROMO (FilterPromo)
 * =========================================================================
 * Ibarat tuas kayu elegan di atas meja kasir yang jika ditekan akan menurunkan
 * rak menu pemilih. Di sini tamu bisa mencentang jenis promosi atau menyeleksi
 * kupon yang masih berlaku, dibantu penuh oleh Petugas Pemilah (useFilterPromo).
 */
export default function FilterPromo({ 
  selectedJenis, 
  setSelectedJenis, 
  selectedStatus, 
  setSelectedStatus 
}) {
  const {
    isOpen,
    dropdownRef,
    toggleDropdown,
    jenisOptions,
    statusOptions
  } = useFilterPromo();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-3 px-8 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all shrink-0 border border-gray-100"
      >
        <SlidersHorizontal className={`h-5 w-5 ${selectedJenis !== 'Semua' || selectedStatus !== 'Semua' ? 'text-[#56BC36]' : 'text-black'}`} />
        <span className={`font-semibold ${selectedJenis !== 'Semua' || selectedStatus !== 'Semua' ? 'text-[#56BC36]' : 'text-black'}`}>
          Filter
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-[260px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Jenis Promo */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Jenis Promo</h4>
            <div className="space-y-1">
              {jenisOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedJenis(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedJenis === opt.value ? 'bg-green-50 text-[#56BC36] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                  {selectedJenis === opt.value && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Status Promo */}
          <div className="p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Status</h4>
            <div className="space-y-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedStatus === opt.value ? 'bg-green-50 text-[#56BC36] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                  {selectedStatus === opt.value && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
