import React from 'react';
// Mengimpor panah penunjuk arah kiri (Previous) dan kanan (Next)
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * =========================================================================
 * TOMBOL PINDAH HALAMAN (Ibarat Tombol Pengganti Lembar Buku)
 * =========================================================================
 * File ini ibarat "Tombol Pindah Halaman Cadangan".
 * Berada di bawah tabel, disiapkan khusus dengan tombol berbingkai abu-abu 
 * dan penanda nomor halaman angka '1' berwarna hijau cerah.
 */
const JadwalPagination = () => {
  return (
    /*
      KOTAK MEMANJANG PEMBUNGKUS TOMBOL:
      - 'flex items-center justify-between': Menyusun tombol Previous di ujung paling kiri, angka halaman di tengah, dan tombol Next di ujung paling kanan.
      - 'mt-6 px-2': Memberikan jarak atas dari tabel dan sedikit jarak di kiri-kanan.
    */
    <div className="flex items-center justify-between mt-6 px-2">
      
      {/* TOMBOL KIRI (PREVIOUS): Tombol putih berbingkai abu-abu bersih dengan sedikit bayangan */}
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        <ArrowLeft size={16} /> Previous
      </button>
      
      {/* PENANDA HALAMAN AKTIF: Kotak kecil bertuliskan angka 1 berwarna hijau cerah khas Mische (#97E779) */}
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#97E779] text-black font-semibold text-sm shadow-sm">
          1
        </button>
      </div>

      {/* TOMBOL KANAN (NEXT): Untuk berpindah ke halaman berikutnya */}
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default JadwalPagination;
