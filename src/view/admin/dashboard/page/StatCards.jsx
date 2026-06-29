import React from 'react';
// Mengimpor 3 stiker ikon bergambar dari gudang perkakas 'lucide-react' (Ikon Grup Pengguna, Tas Belanja, dan Kalender Centang)
import { Users, ShoppingBag, CalendarCheck } from 'lucide-react';

/** 
 * =========================================================================
 * 3 PAPAN REKLAME PENCAPAIAN KILAT (StatCards)
 * =========================================================================
 * Bayangkan komponen ini sebagai "3 Papan Reklame Kilat" di atap mading.
 * Tugas utamanya: Menampilkan angka pencapaian paling bergengsi di bulan ini 
 * secara besar dan jelas agar admin bangga melihatnya:
 * 1. Jumlah Customer Baru
 * 2. Total Pemasukan Penjualan (Omset)
 * 3. Jumlah Reservasi (Booking Treatment)
 */

// =========================================================================
// CETAKAN PAPAN REKLAME MINI (StatCard Template)
// =========================================================================
/**
 * Ini adalah satu cetakan pintar (template) untuk 1 boks papan reklame.
 * Nantinya kita tinggal pasang cetakan ini 3 kali di dinding, lalu mengganti 
 * isian stiker ikon, judul tulisan, dan angka hasil kerjanya. Sangat efisien!
 */
const StatCard = ({ title, description, icon: Icon }) => (

  // Wadah satu reklame: Kotak putih bersudut melengkung, berbingkai tipis, dan berjejer adil (flex-1)
  <div className="bg-white rounded-xl p-5 xl:p-6 flex items-center gap-3 xl:gap-4 shadow-sm flex-1 border border-gray-100">
    
    {/* Kotak Stiker Ikon di sebelah kiri berlapis warna abu-abu terang (bg-gray-50) */}
    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 shrink-0">
      
      {/* Menempelkan stiker ikon sesuai pesanan (misal: Ikon Users atau ShoppingBag) */}
      <Icon size={24} />
    </div>
    
    {/* Kolom Teks di sebelah kanan stiker ikon */}
    <div>

      {/* Judul Papan Reklame (Contoh: "Customer Baru Bulan Ini") */}
      <h3 className="font-semibold text-gray-800 text-[14px] xl:text-base whitespace-nowrap">{title}</h3>
      
      {/* Angka Hasil Pencapaian (Contoh: "150 Customer" atau "Rp 10.000.000") */}
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

// =========================================================================
// MESIN PENCETAK 3 REKLAME BERJEJER (StatCards Main Component)
// =========================================================================

const StatCards = ({ summary }) => {
  /**
   * ASISTEN PERIAS ANGKA UANG (formatRupiah)
   * Berfungsi menyulap angka biasa yang kaku (misal 5000000) menjadi tulisan uang resmi "Rp 5.000.000".
   */
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // 1. MERACIK DAFTAR ISI 3 PAPAN REKLAME
  // Kita meracik isi tulisan untuk ke-3 reklame berdasarkan bungkusan laporan (summary) dari Index.jsx.
  // Tanda tanya titik (?.) adalah helm pengaman agar tidak meledak jika laporannya kosong.
  const stats = [
    { 
      title: 'Customer Baru Bulan Ini', 
      description: `${summary?.new_customers_this_month || 0} Customer`, 
      icon: Users 
    },
    { 
      title: 'Total Penjualan Bulan Ini', 
      description: formatRupiah(summary?.total_sales_this_month || 0), 
      icon: ShoppingBag 
    },
    { 
      title: 'Reservasi Bulan Ini', 
      description: `${summary?.reservations_this_month || 0} Reservasi`, 
      icon: CalendarCheck 
    },
  ];

  return (
    // Wadah besar pembungkus ke-3 papan reklame
    // 'flex flex-col md:flex-row' membuat ketiga reklame:
    // - Di layar kecil (HP): Berbaris bertingkat ke bawah (col).
    // - Di layar besar (Laptop): Berbaris harmonis ke samping (row).
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      
      {/* Looping (Perulangan): Mencetak ketiga reklame menggunakan cetakan <StatCard /> di atas */}
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;

