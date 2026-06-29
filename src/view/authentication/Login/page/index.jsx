import React from 'react';
import { useLoginPage } from '../hooks/useLoginPage';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

/**
 * =========================================================================
 * BALAI ANJUNGAN PINTU MASUK UTAMA (LoginPage)
 * =========================================================================
 * Ibarat bangunan pos penjagaan luar yang megah dan bersih. Balai ini
 * merangkai Plang Sambutan (LoginHeader) dan Meja Formulir (LoginForm)
 * menjadi satu kesatuan rapi, lengkap dengan tombol lonceng "Kembali" di pojok atas.
 */
export default function LoginPage() {
  // Meminjam alat penunjuk jalan dari asisten pengamat pos login (useLoginPage)
  const { navigate } = useLoginPage();

  return (
    // ─── HAMPARAN PEKARANGAN POS PENJAGAAN ───────────────────────────────────
    // Hamparan pekarangan bernuansa krem bersih (#FAF8F5) yang membentang menutupi seluruh pandangan
    <div className="w-full min-h-screen bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      
      {/* ─── BANGUNAN UTAMA POS MASUK (CARD CONTAINER) ──────────────────────── */}
      {/* Bangunan marmer putih berfondasi melengkung (rounded-3xl) dengan bayangan tipis nan elegan */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[500px] p-8 md:p-12 border border-gray-100 relative">
        
        {/* ─── TOMBOL LONCENG KEMBALI ───────────────────────────────────────── */}
        {/* Lonceng kecil di pojok kiri atas untuk memutar balik langkah tamu ke tempat sebelumnya */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-[#56BC36] transition-colors"
        >
          {/* Ikon anak panah menghadap kiri */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 font-medium text-sm">Kembali</span>
        </button>

        {/* ─── PENEMPATAN PAPAN PLANG & MEJA TULIS ──────────────────────────── */}
        {/* Papan plang lambang Mische emas */}
        <LoginHeader />
        {/* Meja kayu formulir beserta asisten mandornya */}
        <LoginForm />

      </div>
    </div>
  );
}

