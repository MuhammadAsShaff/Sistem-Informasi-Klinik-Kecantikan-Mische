import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TableSection = ({ categories, onDeleteClick, onEditClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f9fafb] border-b border-gray-200 text-gray-700">
          <tr>
            <th className="px-6 py-4 font-medium text-center w-16">No</th>
            <th className="px-6 py-4 font-medium text-center">Nama</th>
            <th className="px-6 py-4 font-medium text-center">Deskripsi</th>
            <th className="px-6 py-4 font-medium text-center w-40">Jumlah Produk</th>
            <th className="px-6 py-4 font-bold text-center w-32">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 text-center">{item.name}</td>
                <td className="px-6 py-4 text-center">{item.description}</td>
                <td className="px-6 py-4 text-center">{item.count}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <button 
                      onClick={() => onEditClick(item)}
                      className="hover:text-blue-600 transition-colors" 
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDeleteClick(item.id)} className="hover:text-red-600 transition-colors" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Data tidak ditemukan
              </td>
            </tr>
          )}
          
          {categories.length < 5 && (
            Array.from({ length: 5 - categories.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[61px]">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3 text-gray-400">
                    <Edit size={18} />
                    <Trash2 size={18} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;
