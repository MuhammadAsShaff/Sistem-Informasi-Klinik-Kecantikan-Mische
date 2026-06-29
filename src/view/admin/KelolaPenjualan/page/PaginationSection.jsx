import React from 'react';
// Mengimpor ikon panah ke kiri dan ke kanan
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * =========================================================================
 * BAGIAN TOMBOL PINDAH HALAMAN (Ibarat Tombol Maju Mundur Halaman)
 * =========================================================================
 * Komponen ini berfungsi sebagai tombol navigasi di bagian bawah tabel.
 * Tujuannya agar admin bisa berpindah ke halaman sebelumnya (Previous) 
 * atau halaman berikutnya (Next) jika jumlah pesanan di tabel sangat banyak.
 */
const PaginationSection = () => {
  return (
    <div className="flex items-center justify-between mt-6 px-2">
      {/* Tombol untuk kembali ke halaman sebelumnya (Previous) */}
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        <ArrowLeft size={16} /> Previous
      </button>
      
      {/* Kotak penanda nomor halaman aktif (berwarna hijau terang) */}
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#97E779] text-black font-semibold text-sm shadow-sm">
          1
        </button>
      </div>

      {/* Tombol untuk maju ke halaman berikutnya (Next) */}
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors bg-white shadow-sm cursor-pointer">
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default PaginationSection;
