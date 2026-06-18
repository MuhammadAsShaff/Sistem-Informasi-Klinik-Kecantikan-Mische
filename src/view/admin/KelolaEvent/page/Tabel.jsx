import React from 'react';
import { Edit, Trash2, Send, Eye } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import Table from '../../components/Table';

export default function Tabel({ isLoading, events, onEdit, onDelete, onSend, onView, currentPage = 1, itemsPerPage = 6 }) {
  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-16 text-center', cellClassName: 'text-center text-gray-500' },
    { 
      label: 'Gambar', 
      render: (item) => (
        item.foto ? (
          <img 
            src={item.foto.startsWith('http') ? item.foto : `${STORAGE_BASE_URL}${String(item.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt="Event" 
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
    { 
      label: 'Nama', 
      key: 'nama', 
      render: (item) => (
        <div className="min-w-[150px] max-w-[200px] truncate font-medium text-gray-800" title={item.nama}>
          {item.nama}
        </div>
      ), 
      className: '', 
      cellClassName: '' 
    },
    { label: 'Tanggal Mulai', render: (item) => formatDate(item.tanggalMulai), className: '', cellClassName: 'text-gray-500' },
    { label: 'Tanggal Selesai', render: (item) => formatDate(item.tanggalSelesai), className: '', cellClassName: 'text-gray-500' },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => onView(item)} className="text-gray-500 hover:text-[#56BC36] transition-colors" title="Lihat Detail">
            <Eye size={18} />
          </button>
          <button onClick={() => onEdit(item)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit Event">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(item)} className="text-gray-500 hover:text-red-600 transition-colors" title="Hapus Event">
            <Trash2 size={18} />
          </button>
          <button onClick={() => onSend(item)} className="text-gray-500 hover:text-green-600 transition-colors" title="Kirim Notifikasi">
            <Send size={18} />
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
      data={events} 
      emptyStateText="Tidak ada data event."
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
}
