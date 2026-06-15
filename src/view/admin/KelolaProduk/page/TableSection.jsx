import React from 'react';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const TableSection = ({ categories, onDeleteClick, onEditClick, onUpdateStock, showToast, currentPage = 1, itemsPerPage = 6 }) => {
  const handleUpdateStock = async (id, newStock) => {
    const result = await onUpdateStock(id, newStock);
    if (result && !result.success) {
      if (showToast) showToast(result.message, 'error');
    }
  };


  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f9fafb] border-b border-gray-200 text-gray-700">
          <tr>
            <th className="px-6 py-4 font-medium text-center w-16">No</th>
            <th className="px-6 py-4 font-medium text-center">Gambar</th>
            <th className="px-6 py-4 font-medium text-center">Nama</th>
            <th className="px-6 py-4 font-medium text-center">Deskripsi</th>
            <th className="px-6 py-4 font-medium text-center">Kategori</th>
            <th className="px-6 py-4 font-medium text-center">Harga</th>
            <th className="px-6 py-4 font-medium text-center w-40">Stock</th>
            <th className="px-6 py-4 font-bold text-center w-32">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <tr key={item.idProduk || item.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-6 py-4 align-top text-center">
                  {item.gambar ? (
                    <img 
                      src={item.gambar.startsWith('http') ? item.gambar : `${STORAGE_BASE_URL}${item.gambar}`} 
                      alt="Produk" 
                      className="w-16 h-16 object-cover rounded-md mx-auto shadow-sm" 
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center text-xs text-gray-400">
                      No Img
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center font-medium text-gray-800">{item.nama || item.name}</td>
                <td 
                  className="px-6 py-4 text-center max-w-[200px] truncate" 
                  title={item.deskripsi || item.description}
                >
                  {item.deskripsi || item.description}
                </td>
                <td className="px-6 py-4 text-center">{item.kategori?.nama || item.kategori || "-"}</td>
                <td className="px-6 py-4 text-center">{item.harga ? `Rp ${Number(item.harga).toLocaleString('id-ID')}` : "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4 text-black">
                    <button 
                      onClick={() => handleUpdateStock(item.idProduk || item.id, (item.stock !== undefined ? item.stock : item.count) + 1)}
                      className="hover:text-gray-600 transition-colors focus:outline-none p-1"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                    <span className="w-6 text-center font-medium">{item.stock !== undefined ? item.stock : item.count}</span>
                    <button 
                      onClick={() => handleUpdateStock(item.idProduk || item.id, Math.max(0, (item.stock !== undefined ? item.stock : item.count) - 1))}
                      className="hover:text-gray-600 transition-colors focus:outline-none p-1"
                    >
                      <Minus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <button 
                      onClick={() => onEditClick(item)}
                      className="hover:text-blue-600 transition-colors" 
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDeleteClick(item.idProduk || item.id)} className="hover:text-red-600 transition-colors" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                  Tidak ada data produk.
                </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;
