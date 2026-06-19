import React, { useState } from "react";
import { PencilLine, Trash2, Send, Eye } from "lucide-react";
import { STORAGE_BASE_URL } from "@/core/api/endpoints";
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';

const StatusDropdown = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-[110px] pl-3 pr-2 py-1.5 text-[11px] font-bold rounded-full border outline-none transition-all shadow-sm ${
          status 
            ? "bg-green-50/80 text-[#56BC36] border-green-200 hover:bg-green-100/80" 
            : "bg-red-50/80 text-red-600 border-red-200 hover:bg-red-100/80"
        }`}
      >
        <span>{status ? 'Aktif' : 'Tidak Aktif'}</span>
        <svg 
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-[110px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onChange(true);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors ${
              status ? 'bg-green-50 text-[#56BC36]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Aktif
          </button>
          <div className="h-px bg-gray-100 w-full"></div>
          <button
            onClick={() => {
              onChange(false);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors ${
              !status ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tidak Aktif
          </button>
        </div>
      )}
    </div>
  );
};

export default function Tabel({ isLoading, data, onEdit, onDelete, onDetail, onSend, updateStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-16', cellClassName: 'align-top' },
    { 
      label: 'Nama', 
      key: 'namaPromo', 
      render: (item) => (
        <div className="min-w-[150px] max-w-[200px] truncate" title={item.namaPromo || item.nama}>
          {item.namaPromo || item.nama}
        </div>
      ), 
      className: '', 
      cellClassName: 'align-top' 
    },
    { 
      label: 'Gambar', 
      render: (item) => (
        item.gambar ? (
          <img 
            src={item.gambar.startsWith('http') ? item.gambar : `${STORAGE_BASE_URL}${String(item.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt="Promo" 
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
    { label: 'Kode Promo', render: (item) => <span className="font-medium text-gray-800">{item.kode}</span>, className: '', cellClassName: 'align-top' },
    { 
      label: 'Diskon', 
      render: (item) => {
        const jenis = String(item.jenisPromo || item.jenis_promo || "").toLowerCase();
        const isGratis = jenis.includes("gratis") || item.diskon == 0;
        const isPersen = jenis.includes("persen") || (jenis === "diskon" && item.diskon <= 100) || (!jenis && item.diskon > 0 && item.diskon <= 100);
        const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && item.diskon > 100) || (!jenis && item.diskon > 100);

        if (isGratis) return <span className="font-medium text-gray-600">Gratis Produk</span>;
        if (isPersen) return <span className="font-medium text-[#56BC36]">{item.diskon}%</span>;
        if (isPotongan) return <span className="font-medium text-[#56BC36]">Rp {Number(item.diskon).toLocaleString('id-ID')}</span>;
        return <span>{item.diskon}</span>;
      },
      className: '', 
      cellClassName: 'align-top' 
    },
    { 
      label: 'Status', 
      render: (item) => (
        <StatusDropdown 
          status={item.status} 
          onChange={(newStatus) => updateStatus(item.idPromo || item.id, newStatus)} 
        />
      ), 
      className: '', 
      cellClassName: 'align-top overflow-visible' 
    },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onDetail(item)}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            title="Lihat Detail Promo"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Perbarui Promo"
          >
            <PencilLine size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="Hapus Promo"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => onSend(item)}
            className="text-gray-600 hover:text-green-600 transition-colors"
            title="Kirim Info Promo"
          >
            <Send size={18} />
          </button>
        </div>
      ),
      className: 'font-bold', 
      cellClassName: 'align-top'
    }
  ];

  return (
    <div>
      <Table isLoading={isLoading} 
        columns={columns} 
        data={paginatedData} 
        emptyStateText="Tidak ada data promo."
        startIndex={(currentPage - 1) * itemsPerPage + 1}
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
