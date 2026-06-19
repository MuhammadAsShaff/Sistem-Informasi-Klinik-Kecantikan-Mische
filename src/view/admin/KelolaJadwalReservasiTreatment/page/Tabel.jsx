import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Table from '@/components/Table';

const Tabel = ({ isLoading, data, onEdit, onDelete, currentPage = 1, itemsPerPage = 6 }) => {
  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-16 text-center', cellClassName: 'text-center' },
    { label: 'Jam Mulai', render: (item) => item.jamMulai ? item.jamMulai.substring(0,5) : '', className: 'text-center', cellClassName: 'text-center h-16' },
    { label: 'Jam Selesai', render: (item) => item.jamSelesai ? item.jamSelesai.substring(0,5) : '', className: 'text-center', cellClassName: 'text-center' },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex justify-center gap-6">
          <button 
            onClick={() => onEdit(item)} 
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit size={20}/>
          </button>
          <button 
            onClick={() => onDelete(item)} 
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20}/>
          </button>
        </div>
      ),
      className: 'text-center font-bold', 
      cellClassName: ''
    }
  ];

  return (
    <Table isLoading={isLoading} 
      columns={columns} 
      data={data} 
      emptyStateText="Tidak ada jadwal."
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default Tabel;
