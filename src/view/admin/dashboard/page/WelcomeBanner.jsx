import React from 'react';
import IlustrasiDashboard from '../../../../assets/images/IlustrasiDashboard.png';
import { getUser } from '@/core/utils/authStorage';

/* 
 * =========================================================================
 * WELCOME BANNER (PAPAN UCAPAN SELAMAT DATANG)
 * =========================================================================
 * Ini adalah papan spanduk lucu di bagian paling atas Dashboard yang 
 * menyapa nama Admin (misal: "Welcome Budi").
 */

const WelcomeBanner = () => {
  // Buka brankas untuk mengecek siapa nama orang yang sedang login
  const user = getUser() || {};
  const namaUser = user.nama || user.name || 'Admin';

  return (
    <div className="bg-white rounded-xl p-6 mb-6 flex items-center shadow-sm">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome {namaUser}</h1>
        <p className="text-gray-500 text-sm">
          Kerja keras kita hari ini adalah fondasi untuk membangun klinik kecantikan Mische yang lebih baik.
        </p>
      </div>
      {/* Gambar kartun ilustrasi klinik di sebelah kanan */}
      <div className="hidden md:flex w-48 h-32 items-center justify-center">
        <img src={IlustrasiDashboard} alt="Ilustrasi Dashboard" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default WelcomeBanner;
