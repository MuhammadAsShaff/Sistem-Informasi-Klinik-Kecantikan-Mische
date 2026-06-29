import { useMemo } from 'react';

/** 
 * =========================================================================
 * ASISTEN PEMOTONG KUE PORSI RESERVASI (useTreatmentPieChart)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Pemotong Kue Porsi Reservasi" di klinik Mische.
 * Tugas utamanya: Mengambil catatan kategori treatment apa saja yang paling diburu pelanggan, 
 * lalu membaginya menjadi irisan-irisan porsi agar pas dihidangkan ke dalam nampan 
 * grafik kue bundar (Pie Chart).
 */

export const useTreatmentPieChart = (data) => {
  // =========================================================================
  // KALKULATOR PENGINGAT PORSI KUE (USE-MEMO)
  // =========================================================================
  /*
    Mengapa menggunakan `useMemo`?
    Bayangkan `useMemo` sebagai "Kalkulator Pengingat Porsi Kue". Begitu asisten selesai 
    menghitung besar irisan kue untuk setiap kategori treatment, ukurannya disimpan di memori. 
    JIKA buku catatan reservasi dari server tidak berubah, asisten tidak mau lelah 
    memotong ulang kue yang sama. Hasilnya: Halaman Dashboard bebas dari lemot!
  */
  const chartData = useMemo(() => {
    // Tombol Pengaman: Jika buku reservasi dari server kosong, siapkan nampan kosong []
    if (!data || data.length === 0) return [];
    
    /*
      MEMBAGI IRISAN KUE RESERVASI (DATA MAPPING)
      Asisten memotong-motong data dari backend menjadi format irisan kue standar: 
      { name: Nama Kategori, value: Jumlah Orang Pemesan }.
    */
    return data.map(item => ({
      // Tulis nama kategori reservasi di boks 'name'. JIKA tidak ada namanya, tulis 'Unknown'
      name: item.kategoriReservasi || 'Unknown',
      // Pastikan jumlah pemesan diubah menjadi angka bulat resmi (parseInt). JIKA kosong, anggap 0 (nihil)
      value: parseInt(item.total) || 0
    }));
  }, [data]);

  // =========================================================================
  // MENGIRIM NAMPAN IRISAN KUE KE LAYAR GRAFIK
  // =========================================================================
  // Asisten meletakkan nampan irisan kue yang sudah sangat manis 'chartData' ke komponen TreatmentPieChart
  return { chartData };
};
