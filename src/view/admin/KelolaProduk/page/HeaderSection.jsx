import React from 'react';

/**
 * PAPAN JUDUL HALAMAN PRODUK (HeaderSection)
 * Ibarat spanduk atau plang nama besar yang dipasang di bagian paling atas ruangan.
 * Berfungsi untuk memberi tahu pengunjung bahwa ini adalah ruangan tempat mengelola seluruh produk klinik.
 */
const HeaderSection = () => {
  return (
    <div className="mb-8">
      {/* Tulisan judul utama yang besar dan tebal */}
      <h1 className="text-[28px] font-medium text-gray-800 mb-2">Produk Yang Terdaftar Pada Sistem</h1>
      
      {/* Tulisan penjelasan singkat di bawah judul */}
      <p className="text-sm text-gray-600">
        Halaman Ini Menampilkan Informasi Produk, Termasuk Detail Produk. Anda Dapat Menambah, Memperbarui, Atau Menghapus Produk.
      </p>
    </div>
  );
};

export default HeaderSection;
