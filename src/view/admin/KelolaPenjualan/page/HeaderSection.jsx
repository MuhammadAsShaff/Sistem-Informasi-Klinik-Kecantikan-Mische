import React from 'react';

/**
 * =========================================================================
 * PAPAN PANJI AUDITORIUM PENJUALAN (HeaderSection)
 * =========================================================================
 * Ibarat plakat nama berlapis emas yang dipajang di atas pintu masuk Balai Penjualan.
 * Plakat ini mengumumkan kepada para petugas dan dokter bahwa ruangan ini dikhususkan
 * untuk memantau arus keluar masuk barang, catatan pembayaran, dan status kiriman paket.
 */
const HeaderSection = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-medium text-gray-800 mb-2">Data Penjualan</h1>
      <p className="text-sm text-gray-600">
        Halaman Ini Menampilkan <strong>Data Penjualan</strong> pada sistem, termasuk hal yang berkaitan
      </p>
    </div>
  );
};

export default HeaderSection;
