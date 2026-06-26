import React from 'react';
import { X, Search } from 'lucide-react';
import { useDistribusiEvent } from '../hooks/useDistribusiEvent';

/**
 * =========================================================================
 * KOMPONEN VIEW: ModalDistribusiEvent
 * =========================================================================
 * Komponen ini hanya menangani tampilan visual (UI/Layout) untuk membagikan/
 * mendistribusikan event kepada customer.
 * 
 * Semua logika pengambilan data, pengiriman data ke server, dan state dikelola
 * oleh custom hook `useDistribusiEvent`.
 */
export default function ModalDistribusiEvent({ isOpen, onClose, event, showToast }) {
  // Memanggil custom hook untuk mendapatkan semua data & handler yang dibutuhkan
  const {
    targetType,
    setTargetType,
    searchQuery,
    setSearchQuery,
    selectedCustomers,
    customers,
    isFetching,
    isSubmitting,
    fetchCustomers,
    handleCheckboxChange,
    handleDistribute
  } = useDistribusiEvent({ isOpen, onClose, event, showToast });

  // Jika modal ditutup (isOpen = false), tidak merender apa-apa
  if (!isOpen) return null;

  // Menyalin daftar customer yang telah didapat dari hook ke variabel lokal untuk dirender
  const filteredCustomers = customers;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Distribusi Event <span className="text-[#56BC36] text-lg block sm:inline mt-1 sm:mt-0">{event?.namaKegiatan || event?.nama || ''}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {/* Target Type Dropdown */}
          <div className="mb-10">
            <label className="block text-[15px] font-medium text-gray-800 mb-3">Customer Yang Di Tuju</label>
            <div className="relative max-w-[320px]">
              <select 
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md py-2.5 pl-4 pr-10 text-[15px] text-gray-700 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] cursor-pointer"
              >
                <option value="Pilih Customer">Pilih Customer</option>
                <option value="Semua Customer">Semua Customer</option>
              </select>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-4">
            <h3 className="text-[15px] font-medium text-gray-800">Daftar Nama Yang Di Tuju</h3>
            <div className="flex w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Customer" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 border-r-0 rounded-l-md px-4 py-2 text-[14px] w-full md:w-64 focus:outline-none"
              />
              <button 
                onClick={() => fetchCustomers(searchQuery)}
                className="bg-[#56BC36] px-4 py-2 rounded-r-md text-white flex items-center justify-center hover:bg-[#469e2c] transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-gray-200 bg-white text-gray-600">
                  <th className="py-4 px-6 font-medium text-center w-24">No</th>
                  <th className="py-4 px-6 font-medium">Nama Customer</th>
                  <th className="py-4 px-6 font-medium text-center w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr key={customer.id} className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-center text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6 text-gray-700">
                        <div className="font-medium">{customer.name}</div>
                        {customer.phone && <div className="text-xs text-gray-500 mt-0.5">{customer.phone}</div>}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleCheckboxChange(customer.id)}
                          disabled={targetType === 'Semua Customer'}
                          className={`w-5 h-5 rounded border-gray-300 ${targetType === 'Semua Customer' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} accent-[#56BC36] text-[#56BC36] focus:ring-[#56BC36] checked:bg-[#56BC36] checked:border-[#56BC36]`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      Tidak ada customer ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end bg-white">
          <button 
            onClick={handleDistribute}
            disabled={isSubmitting || isFetching}
            className={`bg-[#56BC36] text-white px-8 py-2.5 rounded-md font-medium transition-colors ${isSubmitting || isFetching ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#469e2c]'}`}
          >
            {isSubmitting ? 'Memproses...' : 'Distribusikan'}
          </button>
        </div>
      </div>
    </div>
  );
}
