import React from 'react';

/**
 * =========================================================================
 * PAPAN NAMA HALAMAN (Ibarat Papan Petunjuk di Depan Lorong Toko)
 * =========================================================================
 * File ini ibarat "Papan Petunjuk" di atas lorong rak toko.
 * Papan ini menampilkan judul besar "Kategori Produk" dan sedikit kalimat penjelas
 * agar admin tahu di halaman ini mereka bisa melihat dan mengatur daftar kategori.
 */
const HeaderSection = () => {
  return (
    // Bagian pembungkus judul dengan sedikit jarak di bagian bawah agar tidak menabrak kotak pencarian
    <div className="mb-8">
      {/* Tulisan utama berukuran besar (28px) dengan warna abu-abu gelap */}
      <h1 className="text-[28px] font-medium text-gray-800 mb-2">Kategori Produk</h1>
      {/* Tulisan kecil penjelas fungsi halaman */}
      <p className="text-sm text-gray-600">
        Halaman ini menampilkan dan mengelola daftar kategori produk yang tersedia di klinik.
      </p>
    </div>
  );
};

export default HeaderSection;
