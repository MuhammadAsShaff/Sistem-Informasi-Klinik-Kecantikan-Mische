import React from 'react';
import { Users, ShoppingBag, CalendarCheck } from 'lucide-react';

/* 
 * =========================================================================
 * STAT CARDS (KARTU RINGKASAN CEPAT)
 * =========================================================================
 * Ini adalah komponen untuk menampilkan 3 kotak di bagian paling atas Dashboard 
 * (Jumlah Customer, Total Penjualan, dan Jumlah Reservasi).
 */

// Desain Template untuk satu kotaknya
const StatCard = ({ title, description, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 xl:p-6 flex items-center gap-3 xl:gap-4 shadow-sm flex-1 border border-gray-100">
    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 shrink-0">
      {/* Memunculkan Ikon sesuai yang dikirim (misal: gambar Tas Belanja) */}
      <Icon size={24} />
    </div>
    <div>
      {/* Judul Kartu */}
      <h3 className="font-semibold text-gray-800 text-[14px] xl:text-base whitespace-nowrap">{title}</h3>
      {/* Angka Hasil */}
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

// Papan yang menggabungkan ke-3 kartu tersebut
const StatCards = ({ summary }) => {
  // Fungsi Mesin Kasir (mengubah angka jadi format Rupiah)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Mengisi data ke-3 kartu dari data laporan (summary) yang dikirim oleh Mading (Index.jsx)
  const stats = [
    { title: 'Customer Baru Bulan Ini', description: `${summary?.new_customers_this_month || 0} Customer`, icon: Users },
    { title: 'Total Penjualan Bulan Ini', description: formatRupiah(summary?.total_sales_this_month || 0), icon: ShoppingBag },
    { title: 'Reservasi Bulan Ini', description: `${summary?.reservations_this_month || 0} Reservasi`, icon: CalendarCheck },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      {/* Looping (Mencetak) ke-3 kartu tersebut agar berjejer ke samping */}
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;
