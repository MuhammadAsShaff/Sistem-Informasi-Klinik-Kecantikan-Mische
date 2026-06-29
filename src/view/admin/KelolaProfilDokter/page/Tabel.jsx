import React from "react";
import { PencilLine, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { STORAGE_BASE_URL } from "@/core/api/endpoints";
import Table from '@/components/Table';
import { useTabelProfilDokter } from "../hooks/useTabelProfilDokter";

/**
 * LEMARI ETALASE DAFTAR DOKTER (Tabel)
 * Ibarat rak etalase rapi tempat memajang seluruh profil dokter. Di setiap barisnya, terpajang 
 * pasfoto bundar, nama dokter, alamat email, kotak cerita (deskripsi) yang bisa dilipat atau dibentangkan, 
 * stempel status kehadiran (Tersedia / Tidak Tersedia) yang bisa diputar seketika, serta tombol 
 * aksi (pensil untuk mengoreksi dan tong sampah untuk mencabut izin).
 */
export default function Tabel({ isLoading, data, onEdit, onDelete, onStatusChange, startIndex = 1 }) {
  // Meminjam asisten penolong kecil untuk mengurus lipat/bentang tulisan dan pergantian status
  const { expandedDescId, handleStatusSelect, toggleExpand } = useTabelProfilDokter(onStatusChange);

  // --- MENYUSUN KEPALA / DAFTAR KOLOM DI ATAS ETALASE ---
  const columns = [
    // Kolom 1: Nomor urut dokter
    { label: 'No', render: (item, index) => index, className: 'w-12 text-center', cellClassName: 'text-center text-xs font-medium text-gray-500' },
    
    // Kolom 2: Nama lengkap dokter
    { label: 'Nama', key: 'nama', className: '', cellClassName: 'text-xs font-bold text-[#1A1A1A] whitespace-nowrap' },
    
    // Kolom 3: Bingkai pasfoto bundar
    { 
      label: 'Foto', 
      render: (item) => {
        // Membersihkan jalur foto. Jika fotonya hilang/kosong, pasang lukisan pengganti (placeholder)
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
                // Jika fotonya gagal dimuat saat dipajang, langsung ganti dengan lukisan pengganti
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
        );
      },
      className: 'text-center w-24', 
      cellClassName: 'text-center'
    },

    // Kolom 4: Alamat surel / email
    { label: 'Email', render: (item) => item.email || "-", className: '', cellClassName: 'text-xs text-gray-500 font-medium' },
    
    // Kolom 5: Kotak Cerita (Deskripsi) beserta tombol lipat / bentang tulisan
    { 
      label: 'Deskripsi', 
      render: (item) => {
        const docId = item.idDokter || item.id;
        return item.deskripsi ? (
          <div>
            {/* Membentangkan tulisan penuh atau melipatnya menjadi 2 baris saja */}
            <div className={`transition-all duration-300 ${expandedDescId === docId ? "whitespace-normal" : "line-clamp-2"}`}>
              {item.deskripsi}
            </div>
            
            {/* Tombol Lipat/Bentang (muncul jika cerita dokternya lumayan panjang) */}
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

    // Kolom 6: Stempel Status Kehadiran (Tersedia / Tidak Tersedia)
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

    // Kolom 7: Tombol Operasi (Pensil untuk Koreksi, Tong Sampah untuk Mencabut Profil)
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(item)}
            className="text-gray-400 hover:text-[#56BC36] transition-colors cursor-pointer"
            title="Perbarui"
          >
            <PencilLine size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Hapus"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: 'text-center w-28 font-bold text-black', 
      cellClassName: ''
    }
  ];

  // Menggelar rak tabel utama menggunakan rancangan kolom di atas
  return (
    <div className="mb-6">
      <Table 
        isLoading={isLoading} 
        columns={columns} 
        data={data} 
        emptyStateText="Belum ada data dokter terdaftar."
        startIndex={startIndex}
      />
    </div>
  );
}
