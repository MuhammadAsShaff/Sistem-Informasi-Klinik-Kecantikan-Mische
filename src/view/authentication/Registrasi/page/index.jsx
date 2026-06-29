import React from 'react';
import { useRegistrasiPage } from '../hooks/useRegistrasiPage';
import RegistrasiHeader from './RegistrasiHeader';
import RegistrasiForm from './RegistrasiForm';

/**
 * =========================================================================
 * BALAI PAVILIUN PENDAFTARAN WARGA BARU (RegistrasiPage)
 * =========================================================================
 * Ibarat bangunan balai paviliun yang luas dan megah. Balai ini menyatukan
 * Papan Plang Sambutan (RegistrasiHeader) dan Meja Panjang Formulir (RegistrasiForm)
 * dalam satu ruangan marmer putih bersudut lengkung, dikawal oleh asisten pengamat loket.
 */
export default function RegistrasiPage() {
  // Meminjam alat penunjuk arah dari asisten pengamat loket (useRegistrasiPage)
  const { navigate } = useRegistrasiPage();

  return (
    // ─── HAMPARAN PEKARANGAN PAVILIUN ────────────────────────────────────────
    // Hamparan pekarangan bernuansa krem asri (#FAF8F5) yang melingkupi seluruh gedung paviliun
    <div className="w-full min-h-screen bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      
      {/* ─── BANGUNAN MARMER PAVILIUN (CARD CONTAINER) ──────────────────────── */}
      {/* Bangunan marmer putih berfondasi lebar (max-w-[800px]) dengan lengkungan halus (rounded-3xl) */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[800px] p-8 md:p-12 border border-gray-100 relative">
        
        {/* ─── TOMBOL LONCENG KEMBALI ───────────────────────────────────────── */}
        {/* Lonceng di sudut kiri atas untuk mempersilakan tamu mengurungkan niat dan berbalik langkah */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-[#56BC36] transition-colors"
        >
          {/* Ikon anak panah mengarah ke kiri */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 font-medium text-sm">Kembali</span>
        </button>

        {/* ─── PENYUSUNAN PLANG & MEJA PANJANG ──────────────────────────────── */}
        {/* Papan plang emas penyambut tamu di bagian atas balai */}
        <RegistrasiHeader />
        {/* Meja panjang bersisi ganda tempat tamu menggoreskan pena biodata */}
        <RegistrasiForm />

      </div>
    </div>
  );
}

