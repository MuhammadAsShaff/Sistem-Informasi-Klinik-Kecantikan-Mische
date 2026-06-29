import React from 'react';
import { Link } from 'react-router-dom';

/**
 * =========================================================================
 * BALAI UJUNG LORONG BUNTU (Page404)
 * =========================================================================
 * Ibarat sebuah balai di ujung lorong paling gelap yang tidak ada pintunya.
 * Tamu yang kesasar sampai ke sini akan disambut plang raksasa bertuliskan "404",
 * penanda bahwa ruangan yang dicarinya belum dibangun atau ia menerobos jalur terlarang.
 * Di bawahnya terdapat pintu gerbang darurat untuk langsung berbalik ke balai utama.
 */
const Page404 = () => {
  return (
    // ─── HAMPARAN BALAI KOSONG ───────────────────────────────────────────────
    // Hamparan ruangan bernuansa abu-abu sejuk (bg-gray-50) setinggi layar penuh (min-h-screen)
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* ─── MIMBAR PLANG BUNTU UTAMA ───────────────────────────────────────── */}
      {/* Mimbar tempat mengukir angka raksasa dan pesan penjelasan kesasar */}
      <div className="text-center">
        
        {/* Angka patung raksasa 404 berwarna abu-abu pudar (text-gray-200) */}
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        
        {/* Ukiran plang pengumuman tebal */}
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
          Halaman Tidak Ditemukan
        </p>
        
        {/* Kalimat penjelas awam mengapa tamu bisa sampai ke ruangan tanpa pintu ini */}
        <p className="mt-4 text-gray-500">
          Maaf, rute yang Anda cari tidak tersedia atau Anda tidak memiliki akses ke halaman ini.
        </p>
        
        {/* ─── PINTU LORONG PENYELAMAT (KEMBALI KE BERANDA) ─────────────────── */}
        {/* Plang kayu hijau melengkung (rounded-full) penghubung kilat menuju Taman Beranda (/) */}
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-[#56BC36] hover:bg-[#4ea830] text-white font-bold rounded-full transition-colors shadow-lg"
        >
          Kembali ke Beranda
        </Link>

      </div>
    </div>
  );
};

export default Page404;

