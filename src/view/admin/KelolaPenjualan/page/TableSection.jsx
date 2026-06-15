import React from 'react';
import { Trash2 } from 'lucide-react';

const TableSection = ({ data, onDeleteClick, currentPage = 1, itemsPerPage = 6 }) => {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f9fafb] border-b border-gray-200 text-gray-700">
          <tr>
            <th className="px-6 py-4 font-medium text-center w-16">No</th>
            <th className="px-6 py-4 font-medium text-center">Nama</th>
            <th className="px-6 py-4 font-medium text-center">Tanggal</th>
            <th className="px-6 py-4 font-medium text-center">Promo</th>
            <th className="px-6 py-4 font-medium text-center">Produk</th>
            <th className="px-6 py-4 font-medium text-center">Jumlah</th>
            <th className="px-6 py-4 font-medium text-center">Total Harga</th>
            <th className="px-6 py-4 font-medium text-center w-32">Status</th>
            <th className="px-6 py-4 font-bold text-center w-24">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 text-center">{item.nama}</td>
                <td className="px-6 py-4 text-center">{item.tanggal}</td>
                <td className="px-6 py-4 text-center">{item.promo}</td>
                <td className="px-6 py-4 text-center">{item.produk}</td>
                <td className="px-6 py-4 text-center">{item.jumlah}</td>
                <td className="px-6 py-4 text-center">{item.totalHarga}</td>
                <td className="px-6 py-4 text-center">
                  <button className="bg-[#56BC36] hover:bg-[#2da509] text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium">
                    Konfirmasi
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center text-gray-600">
                    <button onClick={onDeleteClick} className="hover:text-red-600 transition-colors" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
             null
          )}
          
          {/* Mockup empty rows to match the design (showing empty borders) */}
          {Array.from({ length: Math.max(0, 8 - (data?.length || 0)) }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-[60px] hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-center">
                <button className="bg-[#56BC36] hover:bg-[#2da509] text-white text-xs px-4 py-1.5 rounded-full transition-colors font-medium">
                  Konfirmasi
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-gray-600">
                  <button onClick={onDeleteClick} className="hover:text-red-600 transition-colors" title="Hapus">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;
