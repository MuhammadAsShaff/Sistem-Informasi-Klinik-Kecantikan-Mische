import React from 'react';
import { Trash2, Eye, Truck } from 'lucide-react';
import { formatDate } from '../../../../core/utils/formatDate';
import Table from '../../components/Table';

const TableSection = ({ data, onDeleteClick, onDetailClick, onResiClick, onStatusChange, currentPage = 1, itemsPerPage = 6, isLoading }) => {
  const columns = [
    { label: 'No. Invoice', key: 'invoiceNumber', render: (item) => <span className="font-semibold text-gray-700">{item.invoiceNumber || '-'}</span>, className: 'text-center', cellClassName: 'text-center' },
    { label: 'Nama', key: 'user.nama', render: (item) => item.user?.nama || 'Unknown', className: 'text-center whitespace-nowrap', cellClassName: 'text-center whitespace-nowrap' },
    { label: 'Tanggal', render: (item) => formatDate(item.tanggal), className: 'text-center whitespace-nowrap', cellClassName: 'text-center whitespace-nowrap' },
    { 
      label: 'Total Harga', 
      render: (item) => <span className="text-green-600 font-medium">Rp {item.total ? item.total.toLocaleString('id-ID') : 0}</span>, 
      className: 'text-center', 
      cellClassName: 'text-center' 
    },
    { 
      label: 'Status', 
      render: (item) => (
        <select
          value={item.orderStatus || 'pending'}
          onChange={(e) => onStatusChange(item.idPenjualan || item.id, e.target.value)}
          className={`text-[11px] px-2 py-1.5 rounded-md border font-semibold cursor-pointer outline-none ${
            item.orderStatus === 'selesai' ? 'bg-green-50 text-green-700 border-green-200' :
            item.orderStatus === 'dibatalkan' ? 'bg-red-50 text-red-700 border-red-200' :
            item.orderStatus === 'dikirim' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            item.orderStatus === 'diproses' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      ), 
      className: 'text-center w-32', 
      cellClassName: 'text-center' 
    },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <button onClick={() => onDetailClick(item)} className="hover:text-blue-600 transition-colors" title="Detail">
            <Eye size={18} />
          </button>
          <button onClick={() => onResiClick(item)} className="hover:text-green-600 transition-colors" title="Update Resi">
            <Truck size={18} />
          </button>
          <button onClick={() => onDeleteClick(item.idPenjualan || item.id)} className="hover:text-red-600 transition-colors" title="Hapus">
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: 'text-center w-24', 
      cellClassName: 'text-center'
    }
  ];

  return (
    <Table 
      columns={columns} 
      data={data} 
      isLoading={isLoading}
      emptyStateText="Tidak ada data penjualan"
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default TableSection;
