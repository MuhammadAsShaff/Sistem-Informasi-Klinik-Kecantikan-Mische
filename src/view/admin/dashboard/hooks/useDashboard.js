import { useState, useEffect } from 'react';
// Mengimpor 'endpoints', yaitu buku pedoman rute alamat di kantor backend
import { endpoints } from '@/core/api/endpoints';
// Mengimpor asisten pengambil data super cepat dari pusat memori
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/** 
 * =========================================================================
 * ASISTEN MANAJER EKSEKUTIF DASHBOARD (useDashboard)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Manajer Eksekutif" yang memimpin ruang kendali Dashboard.
 * Tugas utamanya: Berkunjung ke kantor pusat backend untuk memborong seluruh berkas laporan 
 * penting (total penjualan, jumlah pelanggan, omset harian) agar langsung tersaji 
 * rapi di atas meja kerja Admin.
 */

export const useDashboard = () => {
  // =========================================================================
  // 1. MEMINJAM LEMARI ARSIP KILAT (useFetchWithCache)
  // =========================================================================
  /*
    Asisten Manajer kita sangat cerdik! Dia tidak mau sembarangan mengirim kurir 
    menelepon server setiap kali admin memutar atau membuka halaman dashboard. 
    Dia meminjam "Lemari Arsip Kilat" (Cache). Jika salinan datanya masih ada di lemari, 
    langsung hidangkan ke layar dalam 0 detik! Sangat kilat dan hemat tenaga server.
  */
  const { data, isLoading: isCacheLoading, error: cacheError, mutate } = useFetchWithCache(endpoints.admin.dashboard);
  
  // =========================================================================
  // 2. LACI-LACI LAPORAN DI ATAS MEJA KERJA (STATE)
  // =========================================================================
  // Laci 1: Kotak kaca tempat memajang berkas laporan dashboard JIKA sukses mendarat
  const [dashboardData, setDashboardData] = useState(null);
  
  // Laci 2: Kotak peringatan merah tempat menaruh surat keluhan JIKA terjadi kegagalan sistem
  const [error, setError] = useState(null);
  
  // Laci 3: Rambu tanda sibuk (loading) yang meminjam status dari asisten pengambil arsip
  const loading = isCacheLoading;

  // =========================================================================
  // 3. PENCATAT KELUHAN OTOMATIS (USE-EFFECT ERROR)
  // =========================================================================
  /**
   * Asisten pemantau ini langsung melirik jika ada surat keluhan dari kurir arsip (cacheError).
   * JIKA kurir tersandung masalah di jalan, asisten langsung memajang alasan kerusakannya di kotak merah.
   */
  useEffect(() => {
    if (cacheError) {
      setError(cacheError.response?.data?.message || 'Terjadi kesalahan sistem saat memuat laporan.');
    }
  }, [cacheError]);

  // =========================================================================
  // 4. PERAPI BERKAS SUKSES (USE-EFFECT DATA)
  // =========================================================================
  /**
   * JIKA asisten berhasil pulang membawa bungkusan laporan (data), asisten langsung 
   * membongkar bungkusannya (mengambil dari data.data atau data langsung), 
   * menaruhnya di kotak kaca dashboardData, dan menyapu bersih seluruh laci keluhan!
   */
  useEffect(() => {
    if (data) {
      setDashboardData(data.data || data);
      setError(null); // Bersihkan kotak merah
    }
  }, [data]);

  // =========================================================================
  // 5. TOMBOL SAKTI PENYEGAR ARSIP (REFETCH)
  // =========================================================================
  /**
   * Bayangkan ini sebagai "Tombol Sakti Penyegar Otak".
   * Kalau admin menekan tombol Refresh di dashboard, asisten akan menekan tombol `mutate()`.
   * Tugasnya: Merobek arsip lama di Lemari Arsip, dan memaksa kurir berlari mengambil 
   * laporan paling baru ke server backend seketika itu juga!
   */
  const fetchDashboardData = async () => {
    mutate(); // Robek catatan lama dan paksa ambil data terhangat
  };

  // =========================================================================
  // 6. MENYERAHKAN SELURUH PERBEKALAN KE HALAMAN DASHBOARD
  // =========================================================================
  // Asisten menyodorkan kotak laporan 'dashboardData', rambu 'loading', keluhan 'error', dan tombol sakti 'refetch' ke meja halaman Dashboard
  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
