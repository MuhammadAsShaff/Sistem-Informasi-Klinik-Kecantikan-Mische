import React from "react";

/**
 * PAPAN PLANG NAMA RUANGAN (Header)
 * Ibarat plang nama anggun di dinding atas ruangan yang bertuliskan "Profil Dokter". 
 * Di bawah tulisan utama, terdapat kalimat panduan singkat yang memberi tahu bahwa di ruangan 
 * ini admin berhak menambah, memperbarui, atau mencabut profil dokter yang terdaftar di sistem.
 */
export default function Header() {
  return (
    <div className="mb-6">
      {/* Tulisan Plang Utama */}
      <h1 className="text-3xl font-medium text-black mb-2 tracking-tight">
        Profil Dokter
      </h1>
      
      {/* Tulisan Penjelasan / Panduan Ruangan */}
      <p className="text-[13px] text-gray-500 font-regular leading-relaxed max-w-[1200px]">
        Halaman Ini Menampilkan Kelola Profil Dokter yang terdaftar pada sistem, Anda Dapat Menambah, Memperbarui, Atau Menghapus Profil Melalui Halaman Ini.
      </p>
    </div>
  );
}
