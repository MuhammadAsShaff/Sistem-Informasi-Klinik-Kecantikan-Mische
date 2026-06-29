import React from 'react';
// Mengimpor ikon pena edit (Edit) dan tempat sampah (Trash2)
import { Edit, Trash2 } from 'lucide-react';
// Mengimpor komponen dasar tabel utama
import Table from '@/components/Table';

/**
 * =========================================================================
 * TABEL DAFTAR JADWAL ASLI (Ibarat Tabel Catatan Jadwal di Toko)
 * =========================================================================
 * File ini ibarat "Tabel Catatan Jadwal" tempat mencetak daftar 
 * jadwal asli yang diambil dari server pusat.
 * Tugas utamanya: Menampilkan nomor urut, memotong teks jam menjadi 5 karakter rapi, 
 * serta menaruh tombol edit dan tombol hapus di ujung kanan setiap baris.
 */
const Tabel = ({ isLoading, data, onEdit, onDelete, currentPage = 1, itemsPerPage = 6 }) => {
  
  // =========================================================================
  // PENGATURAN KOLOM TABEL UTAMA (COLUMNS CONFIG)
  // =========================================================================
  const columns = [
    { 
      label: 'No', 
      // Mengambil nomor urut otomatis sesuai halaman aktif
      render: (item, index) => index, 
      className: 'w-16 text-center', 
      cellClassName: 'text-center' 
    },
    { 
      label: 'Jam Mulai', 
      /*
        PEMOTONG TEKS ANGKA (substring):
        Teks asli dari server mungkin lebih panjang ('08:30:00'). 
        Perintah ini memotongnya tepat 5 karakter pertama dari kiri ('08:30'), agar terlihat rapi!
      */
      render: (item) => item.jamMulai ? item.jamMulai.substring(0,5) : '', 
      className: 'text-center', 
      cellClassName: 'text-center h-16' 
    },
    { 
      label: 'Jam Selesai', 
      // Memotong teks jam selesai menjadi 5 karakter ('12:00')
      render: (item) => item.jamSelesai ? item.jamSelesai.substring(0,5) : '', 
      className: 'text-center', 
      cellClassName: 'text-center' 
    },
    { 
      label: 'Action', 
      render: (item) => (
        // KOLOM TOMBOL PILIHAN (Tombol Edit Biru & Tombol Hapus Merah)
        <div className="flex justify-center gap-6">
          
          {/* TOMBOL EDIT BIRU: Jika ditekan, sampaikan ke pengatur utama untuk membuka pop-up Edit (`onEdit(item)`) */}
          <button 
            onClick={() => onEdit(item)} 
            className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <Edit size={20}/>
          </button>
          
          {/* TOMBOL HAPUS MERAH: Jika ditekan, sampaikan ke pengatur utama untuk membuka pop-up Konfirmasi Hapus (`onDelete(item)`) */}
          <button 
            onClick={() => onDelete(item)} 
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
    /*
      TABEL RAKSASA UTAMA (Table):
      Menyerahkan daftar jadwal (data), penanda loading (isLoading), dan pengaturan kolom (columns) ke komponen dasar Table.
      Jika kosong, tampilkan tulisan "Tidak ada jadwal.".
    */
    <Table 
      isLoading={isLoading} 
      columns={columns} 
      data={data} 
      emptyStateText="Tidak ada jadwal."
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default Tabel;
