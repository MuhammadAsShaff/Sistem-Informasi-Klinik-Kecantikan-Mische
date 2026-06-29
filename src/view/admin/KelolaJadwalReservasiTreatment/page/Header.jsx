import React from 'react';

/**
 * =========================================================================
 * PAPAN JUDUL HALAMAN (Ibarat Papan Petunjuk di Pintu Masuk Lorong)
 * =========================================================================
 * File ini ibarat "Papan Petunjuk" di atas lorong toko.
 * Tugasnya sangat sederhana: Menampilkan judul besar "Data Jadwal Reservasi Treatment" 
 * beserta penjelasan singkat agar admin tahu fungsi halaman ini.
 */
const Header = () => (
  /*
    KOTAK PEMBUNGKUS JUDUL:
    'mb-4' memberikan sedikit jarak di bagian bawah papan judul,
    agar tulisannya tidak menabrak kotak pencarian di bawahnya.
  */
  <div className="mb-4">
    {/* 
      TULISAN UTAMA HALAMAN:
      - 'text-3xl': Membuat tulisan berukuran sangat besar dan jelas.
      - 'font-medium': Memberikan ketebalan huruf yang pas, tidak terlalu tebal atau tipis.
      - 'text-black': Memberikan warna hitam bersih.
      - 'tracking-tighter': Merapatkan sedikit jarak antar huruf agar terkesan rapi.
    */}
    <h1 className="text-3xl font-medium text-black tracking-tighter">Data Jadwal Reservasi Treatment</h1>
    
    {/* 
      TEKS KETERANGAN SINGKAT:
      - 'text-black text-sm': Tulisan ukuran kecil berwarna hitam yang nyaman dibaca.
      - 'mt-1': Memberikan sedikit jarak dari judul besar di atasnya.
    */}
    <p className="text-black text-sm mt-1">
      Menampilkan data jadwal reservasi treatment lengkap dengan jadwal dan informasi pengguna. Admin dapat melakukan pencarian, edit, dan hapus data.
    </p>
  </div>
);

export default Header;
