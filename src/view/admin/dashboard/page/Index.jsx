import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import StatCards from './StatCards';
import CustomerChart from './CustomerChart';
import TopProductsChart from './TopProductsChart';
import TreatmentPieChart from './TreatmentPieChart';
import SalesLineChart from './SalesLineChart';
import { useDashboard } from '../hooks/useDashboard';

/* 
 * =========================================================================
 * HALAMAN DASHBOARD (PAPAN MADING UTAMA)
 * =========================================================================
 * File ini bertugas menyusun semua komponen kecil (Banner, Kartu Statistik, Grafik) 
 * ke dalam satu layar besar seperti menempel gambar di Papan Mading sekolah.
 */

export default function Dashboard() {
  // 1. Panggil Asisten untuk mengambil laporan data (useDashboard)
  const { dashboardData, loading, error } = useDashboard();

  // 2. Kalau Asisten masih mencari data, tampilkan layar memuat (Loading)
  if (loading) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center">Memuat Dashboard...</div>;
  }

  // 3. Kalau Asisten gagal mengambil laporan, tampilkan teks merah (Error)
  if (error) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  // 4. Kalau data sudah siap, mulai tempel semua gambarnya ke Papan Mading!
  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* Tempel Papan Selamat Datang */}
      <WelcomeBanner />
      
      {/* Tempel Kartu Ringkasan (Total Penjualan, dll) */}
      <StatCards summary={dashboardData?.summary} />
      
      {/* Tempel Grafik Customer dan Grafik Produk Terlaris secara bersebelahan */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <CustomerChart data={dashboardData?.charts?.customer_growth_per_month} />
        <TopProductsChart data={dashboardData?.top_products} />
      </div>

      {/* Tempel Grafik Kue (Treatment) dan Grafik Garis (Penjualan) secara bersebelahan */}
      <div className="flex flex-col lg:flex-row gap-6">
        <TreatmentPieChart data={dashboardData?.charts?.treatment_comparison} />
        <SalesLineChart data={dashboardData?.charts?.sales_growth_per_month} />
      </div>
    </div>
  );
}
