import React, { useState, useEffect } from 'react';
import { useFetchProduk } from '../../KelolaProduk/hooks/useFetchProduk';

export default function ModalExportExcel({ isOpen, onClose, onExport }) {
  const { products } = useFetchProduk();
  
  const [filters, setFilters] = useState({
    idProduk: 'semua',
    tanggalMulai: '',
    tanggalSelesai: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    onExport(filters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 font-poppins">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-[22px] font-bold text-semibold">Export Excel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="space-y-6">
            
            {/* ROW 1 */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Produk</label>
                <select
                  name="idProduk"
                  value={filters.idProduk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm text-gray-700"
                >
                  <option value="semua">Semua Produk</option>
                  {products?.map((p) => (
                    <option key={p.idProduk || p.id} value={p.idProduk || p.id}>{p.nama || p.namaProduk}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="tanggalMulai"
                    value={filters.tanggalMulai}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="tanggalSelesai"
                    value={filters.tanggalSelesai}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-300 flex justify-end mt-4">
          <button 
            type="button"
            onClick={handleExport}
            className="px-6 py-2.5 text-white font-medium rounded-md bg-[#56BC36] hover:bg-[#469e2c]"
          >
            Export To Excel
          </button>
        </div>

      </div>
    </div>
  );
}
