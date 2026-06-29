import React from 'react';
// --- MENGIMPOR KELENGKAPAN MAJALAH DINDING (MADING) ---

// Mengimpor spanduk ucapan selamat datang di atap mading
import WelcomeBanner from './WelcomeBanner';

// Mengimpor 3 papan reklame ringkasan kilat (Customer Baru, Total Penjualan, Reservasi)
import StatCards from './StatCards';

// Mengimpor layar proyektor pilar hijau untuk pertumbuhan customer
import CustomerChart from './CustomerChart';

// Mengimpor papan sirkuit balapan untuk ranking 5 produk terlaris
import TopProductsChart from './TopProductsChart';

// Mengimpor nampan saji kue pizza untuk porsi reservasi treatment
import TreatmentPieChart from './TreatmentPieChart';

// Mengimpor layar proyektor jalur bukit untuk naik-turunnya omset penjualan
import SalesLineChart from './SalesLineChart';

// Mengimpor asisten manajer eksekutif yang memegang seluruh laporan rahasia
import { useDashboard } from '../hooks/useDashboard';

/** 
 * =========================================================================
 * PAPAN MAJALAH DINDING (MADING) RAKSASA MISCHE (Dashboard Index)
 * =========================================================================
 * Bayangkan file ini sebagai "Papan Majalah Dinding (Mading) Utama" di kantor admin Mische.
 * Tugas utamanya: Menyatukan seluruh potongan kertas, spanduk, dan layar proyektor 
 * di atas ke dalam satu dinding besar yang sangat indah, terstruktur, dan megah!
 */

export default function Dashboard() {

  // =========================================================================
  // 1. MEMANGGIL ASISTEN MANAJER EKSEKUTIF (useDashboard)
  // =========================================================================
  /*
    Kita menekan bel memanggil asisten 'useDashboard' yang baru pulang dari server membawa:
    - dashboardData: Ransel besar berisi seluruh laporan lengkap (ringkasan, grafik, juara produk).
    - loading      : Rambu sibuk bernilai 'true' jika asisten masih di jalan.
    - error        : Catatan keluhan merah jika asisten terpeleset atau server meledak.
  */
  const { dashboardData, loading, error } = useDashboard();

  // =========================================================================
  // 2. TIRAI PANGGUNG SEDANG DISIAPKAN (LOADING STATE)
  // =========================================================================
  /*
    JIKA asisten masih berlari di jalan (loading = true), kita jangan biarkan admin 
    melihat dinding kosong. Kita turunkan tirai abu-abu bersih (#F9FAFB) bertuliskan 
    'Memuat Dashboard...' di tengah layar agar admin duduk manis menanti.
  */
  if (loading) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center">Memuat Dashboard...</div>;
  }

  // =========================================================================
  // 3. PENGUMUMAN PERINGATAN MERAH (ERROR STATE)
  // =========================================================================
  /*
    JIKA asisten pulang membawa surat keluhan (error ada isinya), kita hentikan 
    pemasangan mading dan langsung tempelkan surat keluhan berwarna merah di tengah layar!
  */
  if (error) {
    return <div className="p-6 bg-[#F9FAFB] min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  // =========================================================================
  // 4. PEMASANGAN MADING UTAMA (KONDISI SUKSES)
  // =========================================================================
  // Perbekalan sudah siap! Kita mulai menata dinding mading dari atap sampai lantai dasar.
  return (
    // Dinding dasar pembungkus seluruh mading berlapis warna abu-abu bersih (#F9FAFB)
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      
      {/* --- ATAP MADING: SPANDUK SELAMAT DATANG --- */}
      {/* Memasang spanduk beludru penyambut untuk Admin yang sedang bertugas */}
      <WelcomeBanner />
      
      {/* --- BARIS 2: 3 PAPAN REKLAME PENCAPAIAN KILAT --- */}
      {/* Menyerahkan potongan kertas 'summary' (berisi angka total kasir) ke dalam StatCards. 
          Tanda tanya titik (?.) adalah helm pengaman agar mading tidak runtuh jika laporannya kosong. */}
      <StatCards summary={dashboardData?.summary} />
      
      {/* --- BARIS 3: PROYEKTOR CUSTOMER & SIRKUIT JUARA PRODUK --- */}
      {/* 
          JURUS LIPAT OTOMATIS (flex flex-col lg:flex-row):
          - Di layar HP yang sempit (col): Kedua kotak menumpuk vertikal ke bawah.
          - Di layar Laptop yang lega (lg:row): Kedua kotak berbaris akur berdampingan ke samping. 
      */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">

        {/* Kotak Kiri: Proyektor pilar hijau pertumbuhan customer bulanan */}
        <CustomerChart data={dashboardData?.charts?.customer_growth_per_month} />

        {/* Kotak Kanan: Papan sirkuit balapan 5 produk terlaris */}
        <TopProductsChart data={dashboardData?.top_products} />
      </div>

      {/* --- BARIS 4: NAMPAN KUE TREATMENT & JALUR BUKIT OMSET --- */}
      {/* Menggunakan jurus lipat otomatis yang sama untuk menumpuk di HP dan bersebelahan di Laptop */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Kotak Kiri: Nampan saji potongan kue pizza untuk kategori treatment terfavorit */}
        <TreatmentPieChart data={dashboardData?.charts?.treatment_comparison} />
        
        {/* Kotak Kanan: Layar proyektor jalur bukit untuk memantau naik-turunnya omset bulanan */}
        <SalesLineChart data={dashboardData?.charts?.sales_growth_per_month} />
      </div>
    </div>
  );
}
