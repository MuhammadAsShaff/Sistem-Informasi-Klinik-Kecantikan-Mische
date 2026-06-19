import React, { useState } from "react";
import { PencilLine, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { STORAGE_BASE_URL } from "@/core/api/endpoints";
import Table from '@/components/Table';

export default function Tabel({ isLoading, data, onEdit, onDelete, onStatusChange, startIndex = 1 }) {
  const [expandedDescId, setExpandedDescId] = useState(null);

  const handleStatusSelect = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  const toggleExpand = (id) => {
    setExpandedDescId(prev => prev === id ? null : id);
  };

  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-12 text-center', cellClassName: 'text-center text-xs font-medium text-gray-500' },
    { label: 'Nama', key: 'nama', className: '', cellClassName: 'text-xs font-bold text-[#1A1A1A] whitespace-nowrap' },
    { 
      label: 'Foto', 
      render: (item) => {
        const imageUrl = item.foto && !item.foto.startsWith('http')
          ? `${STORAGE_BASE_URL}${String(item.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`
          : (item.foto || "https://via.placeholder.com/150");
          
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm mx-auto bg-gray-50">
            <img
              src={imageUrl}
              alt={item.nama}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
        );
      },
      className: 'text-center w-24', 
      cellClassName: 'text-center'
    },
    { label: 'Email', render: (item) => item.email || "-", className: '', cellClassName: 'text-xs text-gray-500 font-medium' },
    { 
      label: 'Deskripsi', 
      render: (item) => {
        const docId = item.idDokter || item.id;
        return item.deskripsi ? (
          <div>
            <div className={`transition-all duration-300 ${expandedDescId === docId ? "whitespace-normal" : "line-clamp-2"}`}>
              {item.deskripsi}
            </div>
            {item.deskripsi.length > 60 && (
              <button
                onClick={() => toggleExpand(docId)}
                className="text-gray-400 hover:text-[#56BC36] mt-1.5 inline-block focus:outline-none transition-colors"
                title={expandedDescId === docId ? "Tutup" : "Lihat Semua"}
              >
                {expandedDescId === docId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        ) : (
          "-"
        )
      },
      className: 'max-w-xs', 
      cellClassName: 'text-xs text-gray-500 font-medium max-w-xs' 
    },
    { 
      label: 'Status', 
      render: (item) => {
        const isAvailable = (item.status || "Tersedia") === "Tersedia";
        const docId = item.idDokter || item.id;
        return (
          <select
            value={item.status || "Tersedia"}
            onChange={(e) => handleStatusSelect(docId, e.target.value)}
            className={`appearance-none inline-flex items-center gap-1.5 pl-4 pr-10 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:ring-0 ${isAvailable
                ? "bg-green-50 text-[#56BC36] border-[#56BC36]/30 hover:bg-green-100"
                : "bg-red-50 text-red-500 border-red-500/30 hover:bg-red-100"
              }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isAvailable ? '%2356BC36' : '%23ef4444'}' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.6rem center',
              backgroundSize: '14px 14px',
            }}
          >
            <option value="Tersedia" className="text-black font-semibold">Tersedia</option>
            <option value="Tidak Tersedia" className="text-black font-semibold">Tidak Tersedia</option>
          </select>
        );
      },
      className: 'text-center w-36', 
      cellClassName: 'text-center relative' 
    },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(item)}
            className="text-gray-400 hover:text-[#56BC36] transition-colors cursor-pointer"
          >
            <PencilLine size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: 'text-center w-28 font-bold text-black', 
      cellClassName: ''
    }
  ];

  return (
    <div className="mb-6">
      <Table isLoading={isLoading} 
        columns={columns} 
        data={data} 
        emptyStateText="Belum ada data dokter terdaftar."
        startIndex={startIndex}
      />
    </div>
  );
}
