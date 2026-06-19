import React from 'react';
import { STORAGE_BASE_URL } from "@/core/api/endpoints";
import Table from '@/components/Table';

const Tabel = ({ isLoading, data, onEdit, onDelete, currentPage = 1, itemsPerPage = 6 }) => {
  const columns = [
    { label: 'No', render: (item, index) => index, className: 'text-center w-16', cellClassName: 'text-center' },
    { 
      label: 'Foto', 
      render: (item) => (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
            {item.buktiFoto ? (
              <img 
                src={
                  item.buktiFoto.startsWith('http') || item.buktiFoto.startsWith('blob:') || item.buktiFoto.startsWith('data:') 
                    ? item.buktiFoto 
                    : `${STORAGE_BASE_URL}${String(item.buktiFoto).replace(/^(?:public\/|storage\/|\/)+/, '')}?v=${item.updated_at || item.updatedAt || ''}`
                } 
                alt="Testimoni" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gray-200');
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>
        </div>
      ),
      className: 'text-center', 
      cellClassName: 'text-center'
    },
    { label: 'Nama', key: 'namaTester', className: 'text-center', cellClassName: 'text-center text-black max-w-[200px] truncate font-medium', render: (item) => <span title={item.namaTester}>{item.namaTester}</span> },
    { label: 'Tanggal', render: (item) => item.tanggalTreatment ? new Date(item.tanggalTreatment).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-', className: 'text-center', cellClassName: 'text-center' },
    { label: 'Deskripsi', render: (item) => <div className="max-w-[200px] truncate mx-auto" title={item.deskripsi}>{item.deskripsi}</div>, className: 'text-center', cellClassName: 'text-center' },
    { label: 'Jenis Testimoni', key: 'jenisTestimoni', className: 'text-center', cellClassName: 'text-center' },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex justify-center gap-3 items-center">
          <button
            onClick={() => onEdit(item)}
            className="text-gray-500 hover:text-black transition-colors"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-gray-500 hover:text-black transition-colors"
            title="Hapus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      ),
      className: 'text-center font-bold', 
      cellClassName: 'text-center'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center mb-6">
      <div className="w-full font-poppins">
        <Table 
          isLoading={isLoading}
          columns={columns} 
          data={data} 
          emptyStateText="Tidak ada data testimoni."
          startIndex={(currentPage - 1) * itemsPerPage + 1}
        />
      </div>
    </div>
  );
};

export default Tabel;
