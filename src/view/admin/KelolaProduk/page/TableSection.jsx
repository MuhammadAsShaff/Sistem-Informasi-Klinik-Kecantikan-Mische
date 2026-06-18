import React from 'react';
import { Edit, Trash2, Plus, Minus, Eye } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import Table from '../../components/Table';

const TableSection = ({ isLoading, categories, onDeleteClick, onEditClick, onDetailClick, onUpdateStock, showToast, currentPage = 1, itemsPerPage = 6 }) => {
  const handleUpdateStock = async (id, newStock) => {
    const result = await onUpdateStock(id, newStock);
    if (result && !result.success) {
      if (showToast) showToast(result.message, 'error');
    }
  };

  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-16 text-center', cellClassName: 'text-center' },
    { 
      label: 'Gambar', 
      render: (item) => (
        item.gambar ? (
          <img 
            src={item.gambar.startsWith('http') ? item.gambar : `${STORAGE_BASE_URL}${String(item.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt="Produk" 
            className="w-16 h-16 object-cover rounded-md mx-auto shadow-sm" 
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center text-xs text-gray-400">
            No Img
          </div>
        )
      ),
      className: 'text-center',
      cellClassName: 'align-top text-center'
    },
    { label: 'Nama', key: 'nama', render: (item) => <span className="font-medium text-gray-800">{item.nama || item.name}</span>, className: 'text-center', cellClassName: 'text-center' },
    { label: 'Kategori', render: (item) => item.kategori?.nama || item.kategori || "-", className: 'text-center', cellClassName: 'text-center' },
    { label: 'Harga', render: (item) => item.harga ? `Rp ${Number(item.harga).toLocaleString('id-ID')}` : "-", className: 'text-center', cellClassName: 'text-center' },
    { 
      label: 'Stock', 
      render: (item) => (
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
      ),
      className: 'text-center w-40', 
      cellClassName: 'text-center'
    },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <button 
            onClick={() => onDetailClick(item)}
            className="hover:text-green-600 transition-colors" 
            title="Detail"
          >
            <Eye size={18} />
          </button>
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
      ),
      className: 'text-center w-32 font-bold', 
      cellClassName: 'text-center'
    }
  ];

  return (
    <Table isLoading={isLoading} 
      columns={columns} 
      data={categories} 
      emptyStateText="Tidak ada data produk."
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default TableSection;
