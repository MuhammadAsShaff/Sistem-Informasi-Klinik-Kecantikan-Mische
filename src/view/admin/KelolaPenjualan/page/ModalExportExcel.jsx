import React from 'react';

export default function ModalExportExcel({ isOpen, onClose, onExport }) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Jenis Produk</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm text-gray-700"
                >
                  <option value="semua">Semua Produk</option>
                  <option value="Cream">Cream</option>
                  <option value="Serum">Serum</option>
                  <option value="Toner">Toner</option>
                  <option value="Facial Wash">Facial Wash</option>
                  <option value="Masker">Masker</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Jenis Kategori</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm text-gray-700"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="Acne">Acne</option>
                  <option value="Whitening">Whitening</option>
                  <option value="Anti Aging">Anti Aging</option>
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
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date"
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
            onClick={onExport}
            className="px-6 py-2.5 text-white font-medium rounded-md bg-[#56BC36] hover:bg-[#469e2c]"
          >
            Export To Excel
          </button>
        </div>

      </div>
    </div>
  );
}
