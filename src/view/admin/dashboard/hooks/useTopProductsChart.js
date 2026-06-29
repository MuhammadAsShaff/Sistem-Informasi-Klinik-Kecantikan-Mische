import { useMemo } from 'react';

/** 
 * =========================================================================
 * ASISTEN AHLI PEMERINGKAT JUARA (useTopProductsChart)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Ahli Pemeringkat Juara Bertahan" di klinik Mische.
 * Tugas utamanya: Menerima buku laporan 5 produk terlaris dari backend, lalu mengubah 
 * format teksnya menjadi rincian nama piala dan skor penjualan agar siap dipajang 
 * di atas panggung grafik balok horizontal.
 */

export const useTopProductsChart = (data) => {
  // =========================================================================
  // KALKULATOR CERDAS ANTI LEMOT (USE-MEMO)
  // =========================================================================
  /*
    Mengapa kita membungkusnya dengan `useMemo`?
    Bayangkan `useMemo` sebagai "Kalkulator Cerdas Anti Lemot". Begitu asisten selesai 
    menulis daftar 5 produk terlaris, kertas daftarnya disimpan di atas meja. 
    JIKA buku laporan dari server tidak mengalami perubahan, asisten menolak keras 
    untuk menghitung ulang! Hasilnya: Dashboard admin terasa super ngebut tanpa patah-patah.
  */
  const chartData = useMemo(() => {
    // Tombol Pengaman: Jika laporan dari server kosong melompong, kembalikan panggung kosong []
    if (!data || data.length === 0) return [];
    
    /*
      MENULIS ULANG MEDALI JUARA (DATA MAPPING)
      Asisten berkeliling mengecek setiap produk di dalam daftar, lalu menyulapnya 
      menjadi format seragam: { name: Nama Produk, value: Skor Jumlah Terjual }.
    */
    return data.map(item => ({
      // Pajang nama produk di boks 'name'. JIKA namanya misterius/tidak tercatat, tulis 'Unknown'
      name: item.produk?.nama || 'Unknown',
      // Pastikan skor jumlah terjual diubah menjadi angka bulat resmi (parseInt). JIKA kosong, tulis 0
      value: parseInt(item.total_terjual) || 0
    }));
  }, [data]);

  // =========================================================================
  // MENGIRIM DAFTAR JUARA KE PANGGUNG GRAFIK
  // =========================================================================
  // Asisten menyodorkan berkas daftar juara yang sudah sangat rapi 'chartData' ke komponen TopProductsChart
  return { chartData };
};
