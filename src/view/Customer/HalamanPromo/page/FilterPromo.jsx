import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';

export default function FilterPromo({ 
  selectedJenis, 
  setSelectedJenis, 
  selectedStatus, 
  setSelectedStatus 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const jenisOptions = [
    { label: 'Semua Jenis', value: 'Semua' },
    { label: 'Gratis Produk', value: 'gratis produk' },
    { label: 'Diskon Persen', value: 'diskon persen' },
    { label: 'Potongan Harga', value: 'potongan harga' }
  ];

  const statusOptions = [
    { label: 'Semua Status', value: 'Semua' },
    { label: 'Masih Berlaku', value: 'Aktif' },
    { label: 'Tidak Berlaku', value: 'Tidak Aktif' }
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
