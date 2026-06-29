import { useState } from 'react';

/** 
 * =========================================================================
 * ASISTEN AHLI SENSUS PELANGGAN BARU (useCustomerChart)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Ahli Sensus Pribadi" di kantor admin Mische.
 * Tugas utamanya: Mengambil tumpukan buku catatan jumlah pelanggan baru dari server, 
 * lalu merapikan angkanya ke dalam tabel pembagian per bulan agar siap digambar 
 * menjadi pilar-pilar grafik yang megah dan indah di layar Dashboard.
 */

// Daftar nama bulan standar (Ibarat label stiker kalender di dinding)
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const useCustomerChart = (data) => {
  // =========================================================================
  // 1. LACI SAKLAR PEMILAH WAKTU (STATE)
  // =========================================================================
  // Laci penyimpanan untuk mencatat saklar waktu mana yang sedang menyala (Contoh: '1M' untuk 1 bulan terakhir)
  const [activeFilter, setActiveFilter] = useState('1M');
  // Daftar pilihan saklar di atas meja kerja (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun, atau Semua Waktu)
  const filters = ['1M', '3M', '6M', '1Y', 'ALL'];

  // =========================================================================
  // 2. TUGAS MENGISI RAPOR BULANAN (DATA MAPPING)
  // =========================================================================
  /**
   * Asisten memasangkan setiap stiker nama bulan dengan jumlah pelanggannya masing-masing.
   */
  const chartData = monthNames.map((month, index) => {
    /*
      MENGUBAH KODE RUTE KE SERVER
      Server di backend lebih suka melihat angka bulan berdigit dua ('01' untuk Januari, '02' untuk Februari).
      Fungsi `padStart(2, '0')` adalah jurus penyulap yang menyulap angka '1' menjadi '01'.
    */
    const monthKey = String(index + 1).padStart(2, '0');
    
    return {
      name: month, // Pajang nama bulan di boks 'name'
      value: data ? data[monthKey] || 0 : 0 // JIKA ada data dari server, catat angkanya. Jika kosong, tulis 0 (nihil).
    };
  });

  // =========================================================================
  // 3. MESIN POTONG KALENDER (getFilteredData)
  // =========================================================================
  /**
   * Fungsi ini bertindak sebagai "Mesin Ahli Potong Kalender".
   * Kalau admin menekan saklar '3M' (3 bulan), mesin akan memotong 9 bulan lainnya 
   * agar layar admin hanya berfokus pada pergerakan 3 bulan terakhir. Sangat jenius!
   */
  const getFilteredData = () => {
    const currentMonthIndex = new Date().getMonth(); // Melihat letak bulan saat ini di kalender jam dinding (0-11)
    let numMonths = 12; // Patokan dasar kalender 1 tahun (12 bulan)
    
    // Asisten mengecek saklar mana yang sedang menyala
    if (activeFilter === '1M') numMonths = 1;
    else if (activeFilter === '3M') numMonths = 3;
    else if (activeFilter === '6M') numMonths = 6;

    // JIKA admin menekan tombol 1 Tahun ('1Y') atau Semua ('ALL'), asisten langsung menghidangkan kalender utuh (12 bulan)
    if (numMonths === 12 || activeFilter === 'ALL' || activeFilter === '1Y') {
      return chartData;
    }

    // JIKA admin memilih bulan pendek (misal 3M), asisten langsung menghitung titik potong awal (startIndex)
    const startIndex = Math.max(0, currentMonthIndex - numMonths + 1);
    
    // Gunting (slice) kalendernya dari titik potong awal sampai bulan saat ini
    return chartData.slice(startIndex, currentMonthIndex + 1);
  };

  // =========================================================================
  // 4. MENGIRIM BERKAS SIAP SAJI KE HALAMAN GRAFIK
  // =========================================================================
  // Asisten menyerahkan catatan saklar 'activeFilter', pengubah saklar 'setActiveFilter', daftar tombol 'filters', dan kalender hasil potongan 'filteredChartData' ke halaman CustomerChart
  return {
    activeFilter,
    setActiveFilter,
    filters,
    filteredChartData: getFilteredData()
  };
};
