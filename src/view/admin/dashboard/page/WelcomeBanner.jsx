import React from 'react';

// Mengimpor lukisan ilustrasi kartun klinik untuk mempercantik pojok spanduk
import IlustrasiDashboard from '../../../../assets/images/IlustrasiDashboard.png';

// Mengimpor kunci pembuka brankas memori lokal (getUser) untuk mengintip KTP siapa yang login
import { getUser } from '@/core/utils/authStorage';

/** 
 * =========================================================================
 * SPANDUK BELUDRU UCAPAN SELAMAT DATANG (WelcomeBanner)
 * =========================================================================
 * Bayangkan komponen ini sebagai "Spanduk Beludru Mewah" yang terbentang 
 * di puncak tertinggi papan Mading Dashboard. Tugas utamanya: Menyapa Admin 
 * secara hangat dan personal dengan mengukir namanya langsung di spanduk 
 * (Contoh: "Welcome, Budi!").
 */

const WelcomeBanner = () => {
  // =========================================================================
  // 1. MENGINTIP BRANKAS RAHASIA BROWSER (getUser)
  // =========================================================================
  // Kita membuka brankas penyimpanan browser (getUser) untuk mengambil berkas KTP Admin.
  // Jika karena suatu hal brankasnya kosong, kita taruh boks kosong {} sebagai tameng pengaman.
  const user = getUser() || {};

  // =========================================================================
  // 2. MENENTUKAN NAMA UKIRAN SPANDUK
  // =========================================================================
  // Kita mencari tahu nama user dari baris tulisan 'nama' atau 'name'.
  // Jika kedua baris itu misterius/hilang, asisten otomatis mengukir nama 'Admin'.
  const namaUser = user.nama || user.name || 'Admin';

  return (
    // Wadah Spanduk: Kotak putih bersudut melengkung manis (rounded-xl) dengan bayangan halus (shadow-sm)
    <div className="bg-white rounded-xl p-6 mb-6 flex items-center shadow-sm">
      
      {/* ======================================================================
          BAGIAN KIRI: UKIRAN SAPAAN & KALIMAT MOTIVASI
          ====================================================================== */}
      {/* flex-1 membuat area tulisan ini merajai seluruh sisa ruang kosong di sebelah kiri */}
      <div className="flex-1">

        {/* Ukiran sapaan besar berwarna abu-abu gelap */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome {namaUser}</h1>
        
        {/* Kalimat penyemangat pembakar semangat juang Admin */}
        <p className="text-gray-500 text-sm">
          Kerja keras kita hari ini adalah fondasi untuk membangun klinik kecantikan Mische yang lebih baik.
        </p>
      </div>

      {/* ======================================================================
          BAGIAN KANAN: LUKISAN ILUSTRASI KARTUN
          ====================================================================== */}
      {/* 
          JURUS MENGHILANG DI LAYAR SEMPIT (hidden md:flex):
          - Di layar HP yang sempit (hidden): Lukisannya disembunyikan asisten agar layar tidak sumpek.
          - Di layar Laptop yang lega (md:flex): Lukisannya baru dipajang dengan gagah! 
      */}
      <div className="hidden md:flex w-48 h-32 items-center justify-center">
        {/* object-contain memastikan lukisan pas di dalam bingkai tanpa terjepit atau terpotong */}
        <img src={IlustrasiDashboard} alt="Ilustrasi Dashboard" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default WelcomeBanner;

