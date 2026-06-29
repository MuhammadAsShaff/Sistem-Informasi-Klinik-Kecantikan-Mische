import React from 'react';

/**
 * PAPAN PLANG NAMA RUANGAN (Header)
 * Ibarat papan plang besar yang terpaku kokoh di atas pintu masuk ruangan "Pengaturan Tentang Kami".
 * Papan ini menjelaskan kepada admin bahwa di ruangan ini mereka berhak meracik cerita riwayat klinik, 
 * visi-misi, serta memajang foto dokumentasi kegiatan klinik.
 */
const Header = () => {
  return (
    <div className="mb-6">
      <h1 className="text-[28px] font-medium text-black mb-1">Pengaturan Tentang Kami</h1>
      <p className="text-[13px] text-gray-800 font-medium">
        Halaman ini menampilkan informasi Tentang Kami yang tersedia di sistem. Anda dapat menambah, memperbarui, atau menghapus Tentang Kami sesuai kebutuhan.
      </p>
    </div>
  );
};

export default Header;
