import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Table from '../../components/Table';

const TableSection = ({ isLoading, categories, onDeleteClick, onEditClick, currentPage = 1, itemsPerPage = 6 }) => {
  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-16 text-center', cellClassName: 'text-center' },
    { label: 'Nama', key: 'nama', render: (item) => item.nama || item.name, className: 'text-center', cellClassName: 'text-center' },
    { 
      label: 'Deskripsi', 
      render: (item) => (
        <div className="max-w-[200px] truncate mx-auto" title={item.deskripsi || item.description}>
          {item.deskripsi || item.description}
        </div>
      ),
      className: 'text-center', 
      cellClassName: 'text-center' 
    },
    { label: 'Jumlah Produk', render: (item) => <span className="font-medium">{item.count !== undefined ? item.count : '-'}</span>, className: 'text-center w-40', cellClassName: 'text-center' },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <button 
            onClick={() => onEditClick(item)}
            className="hover:text-blue-600 transition-colors" 
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button onClick={() => onDeleteClick(item.idKategori || item.id)} className="hover:text-red-600 transition-colors" title="Hapus">
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
      emptyStateText="Data tidak ditemukan"
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default TableSection;
