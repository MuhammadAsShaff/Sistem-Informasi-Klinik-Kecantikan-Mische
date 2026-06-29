import { useState } from 'react';

/** 
 * =========================================================================
 * ASISTEN AKUNTAN AHLI GRAFIK OMSET (useSalesLineChart)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Akuntan Senior" yang bertugas mengurusi buku kasir.
 * Tugas utamanya: Membedah catatan omset penjualan dari server backend, lalu merombak 
 * angkanya menjadi koordinat titik-titik yang siap ditarik menjadi garis grafik (line chart) 
 * menanjak yang indah di layar Dashboard Admin.
 */

// Stiker nama-nama bulan (label dinding pembatas kalender)
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const useSalesLineChart = (data) => {
  // =========================================================================
  // 1. KOTAK SAKLAR PEMOTONG LAPORAN (STATE)
  // =========================================================================
  // Laci untuk menyimpan posisi saklar waktu yang dipilih admin (Contoh: '1M' untuk melihat omset 1 bulan terakhir)
  const [activeFilter, setActiveFilter] = useState('1M');
  // Daftar tombol saklar di meja akuntan (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun, atau Sepanjang Masa)
  const filters = ['1M', '3M', '6M', '1Y', 'ALL'];

  // =========================================================================
  // 2. MENYUSUN NERACA BULANAN (DATA MAPPING)
  // =========================================================================
  /**
   * Asisten akuntan menjejerkan nama bulan dan menempelkan jumlah omset uang masuk di sampingnya.
   */
  const chartData = monthNames.map((month, index) => {
    /*
      PENYESUAIAN KODE KASIR SERVER
      Server backend mencatat laci kasirnya dengan nomor 2 digit ('01' untuk Januari, '02' untuk Februari).
      Kita menyulap indeks urutan (misal angka 1) menjadi teks berdigit ganda '01' lewat jurus `padStart(2, '0')`.
    */
    const monthKey = String(index + 1).padStart(2, '0');
    
    return {
      name: month, // Pasang stiker nama bulan di boks 'name'
      value: data ? data[monthKey] || 0 : 0 // JIKA buku kasir server memberi angka omset, catat! JIKA kosong, tulis 0 (tidak ada omset).
    };
  });

  // =========================================================================
  // 3. PENGGUNTING KERTAS LAPORAN OMSET (getFilteredData)
  // =========================================================================
  /**
   * Fungsi ini adalah alat "Penggunting Kertas Laporan".
   * JIKA admin memilih saklar '3M' (3 bulan), alat ini otomatis membuang catatan 9 bulan 
   * lainnya agar layar grafik hanya menampilkan naik-turunnya omset di 3 bulan terakhir.
   */
  const getFilteredData = () => {
    const currentMonthIndex = new Date().getMonth(); // Melihat bulan saat ini di jam dinding kalender (0-11)
    let numMonths = 12; // Standar bentangan kertas laporan 1 tahun penuh (12 bulan)
    
    // Menyesuaikan bentangan kertas berdasarkan saklar yang menyala
    if (activeFilter === '1M') numMonths = 1;
    else if (activeFilter === '3M') numMonths = 3;
    else if (activeFilter === '6M') numMonths = 6;

    // JIKA saklar menunjuk ke 1 Tahun ('1Y') atau Semua ('ALL'), bentangkan kertas utuh 12 bulan tanpa dipotong!
    if (numMonths === 12 || activeFilter === 'ALL' || activeFilter === '1Y') {
      return chartData;
    }

    // JIKA memilih bulan pendek (misal 3M), tentukan titik potong awal (startIndex)
    const startIndex = Math.max(0, currentMonthIndex - numMonths + 1);
    
    // Potong (slice) kertas laporan dari titik potong awal sampai bulan saat ini
    return chartData.slice(startIndex, currentMonthIndex + 1);
  };

  // =========================================================================
  // 4. MENGIRIM NERACA MATANG KE HALAMAN GRAFIK PENJUALAN
  // =========================================================================
  // Asisten akuntan meletakkan catatan saklar 'activeFilter', pengubah saklar 'setActiveFilter', tombol 'filters', dan neraca hasil potongan 'filteredChartData' ke halaman SalesLineChart
  return {
    activeFilter,
    setActiveFilter,
    filters,
    filteredChartData: getFilteredData()
  };
};
