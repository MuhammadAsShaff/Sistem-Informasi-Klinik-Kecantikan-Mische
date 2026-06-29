import React from 'react';

/**
 * =========================================================================
 * PAPAN JUDUL ALTERNATIF (Ibarat Papan Judul Cadangan di Toko)
 * =========================================================================
 * File ini ibarat "Papan Judul Cadangan" dengan gaya warna abu-abu gelap.
 * Papan ini disiapkan jika admin menginginkan judul dengan jarak bawah 
 * yang lebih besar (mb-10) dibandingkan judul biasa.
 */
const JadwalHeader = () => {
  return (
    /*
      KOTAK PEMBUNGKUS JUDUL:
      'mb-10' memberikan jarak bawah yang cukup besar agar terkesan lapang 
      dan tidak padat dengan elemen di bawahnya.
    */
    <div className="mb-10">
      
      {/* 
        TULISAN UTAMA:
        - 'text-3xl font-bold': Teks berukuran besar dengan tulisan tebal (bold).
        - 'text-gray-800': Memilih warna abu-abu gelap bersih (bukan hitam pekat).
        - 'mb-2': Memberikan sedikit jarak antara judul dengan tulisan penjelas di bawahnya.
      */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Jadwal Reservasi Treatment</h1>
      
      {/* 
        TULISAN KETERANGAN PENJELAS:
        - 'text-gray-500 text-sm': Tulisan ukuran kecil berwarna abu-abu sedang yang lembut di mata.
      */}
      <p className="text-gray-500 text-sm">
        Menampilkan data jadwal reservasi treatment lengkap dengan jadwal dan informasi pengguna. 
        Admin dapat melakukan pencarian, edit, dan hapus data.
      </p>
    </div>
  );
};

export default JadwalHeader;
