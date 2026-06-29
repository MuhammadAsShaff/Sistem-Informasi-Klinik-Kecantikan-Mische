import React from "react";
import { PencilLine, Trash2, Eye } from "lucide-react";
import { formatDate } from "@/core/utils/formatDate";
import Table from '@/components/Table';

/**
 * MEJA PAMERAN DAFTAR ANGGOTA (Tabel)
 * Ibarat etalase panjang di tengah balai tempat memajang nama-nama anggota klinik beserta lencananya.
 * Etalase ini membeberkan pilar nomor, nama, lencana kedudukan (Admin/Staff/Customer), alamat email, 
 * dan nomor WhatsApp. Di ujung kanan setiap baris, tersedia 3 tombol sakti: ikon mata (Bilik Detail),
 * tombol pensil (Bilik Perbaikan Biodata), dan tombol tong sampah (Plang Pencabutan Keanggotaan).
 */
export default function Tabel({ isLoading, data, onEdit, onDelete, onDetail, startIndex = 1 }) {
  // Pilar-pilar meja pameran tempat menaruh keterangan keanggotaan
  const columns = [
    { label: 'No', render: (item, index) => index, className: 'w-12 text-center', cellClassName: 'text-xs font-medium text-gray-500 text-center' },
    { label: 'Nama', key: 'nama', render: (item) => item.nama || item.name || "-", className: '', cellClassName: 'text-xs font-bold text-[#1A1A1A] whitespace-nowrap' },
    { 
      label: 'Role', 
      render: (item) => (
        /* Lencana warna-warni penanda kedudukan */
        <span className={`px-2 py-1 rounded-md capitalize ${(item.role || '').toLowerCase() === 'admin' ? 'bg-orange-50 text-orange-600' :
          (item.role || '').toLowerCase() === 'staff' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
          }`}>
          {item.role || "-"}
        </span>
      ),
      className: 'text-center', 
      cellClassName: 'text-xs font-bold text-center' 
    },
    { label: 'Email', render: (item) => item.email || "-", className: '', cellClassName: 'text-xs text-gray-500 font-medium' },
    { label: 'Nomor Whatsapp', render: (item) => item.nomorWa || item.whatsapp || item.nomor_whatsapp || item.no_wa || "-", className: '', cellClassName: 'text-xs text-gray-500 font-medium whitespace-nowrap' },
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3">
          {/* Tombol Mata (Klik untuk membuka bilik buku profil) */}
          <button
            onClick={() => onDetail(item)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Lihat Detail User"
          >
            <Eye size={18} />
          </button>
          
          {/* Tombol Pensil (Klik untuk membuka meja koreksi biodata) */}
          <button
            onClick={() => onEdit(item)}
            className="text-gray-400 hover:text-[#56BC36] transition-colors"
            title="Perbarui User"
          >
            <PencilLine size={18} />
          </button>
          
          {/* Tombol Tong Sampah (Klik untuk membuka plang pencabutan keanggotaan) */}
          <button
            onClick={() => onDelete(item)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Hapus User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: 'text-center font-bold text-black', 
      cellClassName: ''
    }
  ];

  return (
    /* Menggelar Etalase Tabel Bersama Asisten Arsip */
    <Table isLoading={isLoading} 
      columns={columns} 
      data={data} 
      emptyStateText="Belum ada data user."
      startIndex={startIndex}
    />
  );
}
