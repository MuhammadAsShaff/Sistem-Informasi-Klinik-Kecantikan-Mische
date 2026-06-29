import React from 'react';
import Logo from '@/assets/images/LogoMische.png';

/**
 * =========================================================================
 * PAPAN PLANG LAMBANG DAN UCAPAN SELAMAT DATANG (LoginHeader)
 * =========================================================================
 * Ibarat ukiran logo klinik dari kuningan emas yang dipajang tepat di atas
 * meja satpam, beserta ukiran kalimat instruksi menyambut para tamu yang baru tiba.
 */
const LoginHeader = () => {
  return (
    <>
      {/* ─── UKIRAN LAMBANG KLINIK ──────────────────────────────────────────── */}
      {/* Membungkus bingkai gambar lambang klinik agar posisinya seimbang di tengah */}
      <div className="flex justify-center mb-8">
        <img src={Logo} alt="Mische Aesthetic Clinic" className="h-14 w-auto object-contain" />
      </div>

      {/* ─── PAPAN INSTRUKSI SELAMAT DATANG ─────────────────────────────────── */}
      {/* Menampilkan judul besar 'Login' dan petunjuk bagi tamu untuk menyerahkan kredensial */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-black mb-1">Login</h1>
        <p className="text-[14px] text-gray-700 font-medium">
          Masukkan Email Dan Password Yang Terdaftar
        </p>
      </div>
    </>
  );
};

export default LoginHeader;

