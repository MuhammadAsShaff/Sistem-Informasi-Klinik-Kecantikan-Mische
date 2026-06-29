import React from 'react';
// Mengimpor ikon-ikon patung aksi (Edit, Hapus, Kirim, Mata/Detail) dari pustaka lucide-react
import { Edit, Trash2, Send, Eye } from 'lucide-react';
// Mengimpor alamat gudang penyimpanan gambar (STORAGE_BASE_URL) di server backend
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
// Mengimpor fondasi meja panjang utama pembungkus tabel
import Table from '@/components/Table';

/**
 * =========================================================================
 * MEJA PANJANG PEMAJANG ARSIP EVENT (Tabel Kelola Event)
 * =========================================================================
 * Ibarat sebuah meja panjang marmer tempat Mandor memajang deretan arsip event
 * yang telah dipotong rapi sebanyak 6 kotak. Di setiap baris arsip, tersedia
 * deretan tombol lonceng untuk memanggil petugas rincian (mata), petugas
 * perbaikan (pensil), petugas kebersihan (tong sampah), atau kurir WA (pesawat).
 */
export default function Tabel({ isLoading, events, onEdit, onDelete, onSend, onView, currentPage = 1, itemsPerPage = 6 }) {
  
  /**
   * ─── ASISTEN PENERJEMAH TANGGAL (formatDate) ───────────────────────────────
   * Menyulap kalender angka kaku dari server (misal: '2026-06-28') 
   * menjadi tulisan tangan berstandar Indonesia yang rapi (misal: '28 Juni 2026').
   */
  const formatDate = (dateString) => {
    if (!dateString) return "-"; // Jika tanggal kosong, beri garis penghubung (-)
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  /**
   * ─── CETAKAN REKAP LAJUR MEJA (columns) ────────────────────────────────────
   * Deretan laci yang mengatur letak nomor urut, potret promosi, nama, tanggal, dan tombol aksi.
   */
  const columns = [
    // 1. LAJUR NOMOR URUT
    // Mengukir angka urut seimbang di tengah lajur (w-16 text-center)
    { label: 'No', render: (item, index) => index, className: 'w-16 text-center', cellClassName: 'text-center text-gray-500' },
    
    // 2. LAJUR GAMBAR PROMOSI
    { 
      label: 'Gambar', 
      render: (item) => (
        item.foto ? (
          /* 
            Memajang potret cerdik:
            - Jika potret dari luar (http), langsung pasang di bingkai.
            - Jika potret dari gudang lokal, gabungkan dengan STORAGE_BASE_URL sambil memangkas garis miring ganda.
          */
          <img 
            src={item.foto.startsWith('http') ? item.foto : `${STORAGE_BASE_URL}${String(item.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt="Event" 
            className="w-16 h-16 object-cover rounded-md mx-auto shadow-sm" 
          />
        ) : (
          // Kotak cadangan jika arsip tidak memiliki potret
          <div className="w-16 h-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center text-xs text-gray-400">
            No Img
          </div>
        )
      ),
      className: 'text-center',
      cellClassName: 'align-top text-center'
    },
    
    // 3. LAJUR NAMA EVENT
    { 
      label: 'Nama', 
      key: 'nama', 
      render: (item) => (
        /* truncate: Memotong tulisan panjang dengan titik-titik (...) agar fondasi meja tidak retak/melebar */
        <div className="min-w-[150px] max-w-[200px] truncate font-medium text-gray-800" title={item.nama}>
          {item.nama}
        </div>
      ), 
      className: '', 
      cellClassName: '' 
    },
    
    // 4. LAJUR TANGGAL MULAI
    // Mengutus asisten formatDate untuk menyulap penanggalan
    { label: 'Tanggal Mulai', render: (item) => formatDate(item.tanggalMulai), className: '', cellClassName: 'text-gray-500' },
    
    // 5. LAJUR TANGGAL SELESAI
    // Mengutus asisten formatDate untuk menyulap penanggalan selesai
    { label: 'Tanggal Selesai', render: (item) => formatDate(item.tanggalSelesai), className: '', cellClassName: 'text-gray-500' },
    
    // 6. LAJUR TOMBOL LONCENG AKSI (ACTION BUTTONS)
    { 
      label: 'Action', 
      render: (item) => (
        // Meja kecil penampung 4 tombol lonceng berjajar rapi (gap-3)
        <div className="flex items-center justify-center gap-3">
          
          {/* TOMBOL LONCENG PENGINTAI (MATA): Membunyikan onView(item) untuk menyingkap plang detail */}
          <button onClick={() => onView(item)} className="text-gray-500 hover:text-[#56BC36] transition-colors" title="Lihat Detail">
            <Eye size={18} />
          </button>
          
          {/* TOMBOL LONCENG PERBAIKAN (PENSIL): Membunyikan onEdit(item) untuk menyingkap plang edit */}
          <button onClick={() => onEdit(item)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit Event">
            <Edit size={18} />
          </button>
          
          {/* TOMBOL LONCENG PENGHANCUR (TONG SAMPAH): Membunyikan onDelete(item) untuk menyingkap plang hapus */}
          <button onClick={() => onDelete(item)} className="text-gray-500 hover:text-red-600 transition-colors" title="Hapus Event">
            <Trash2 size={18} />
          </button>
          
          {/* TOMBOL LONCENG KURIR WA (PESAWAT): Membunyikan onSend(item) untuk menyingkap plang distribusi WA */}
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
    /* 
      MEMBENTANGKAN FONDASI MEJA PANJANG (TABLE):
      Meneruskan cetakan lajur (columns), daftar arsip (events), rambu sibuk (isLoading),
      serta menghitung rumus nomor urut bersambung: (Halaman - 1) * 6 + 1.
    */
    <Table 
      isLoading={isLoading} 
      columns={columns} 
      data={events} 
      emptyStateText="Tidak ada data event." // Ukiran plang pengumuman jika laci arsip kosong
      startIndex={(currentPage - 1) * itemsPerPage + 1} 
    />
  );
}
