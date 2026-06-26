import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/* 
 * =========================================================================
 * USE DASHBOARD (ASISTEN PENCARI BERITA)
 * =========================================================================
 * Fungsi ini bertindak seperti "Asisten Pribadi". Tugasnya adalah pergi ke 
 * server (Backend) untuk mengambil laporan terbaru (data penjualan, jumlah customer, dll)
 * untuk ditampilkan di halaman Dashboard Admin.
 */

export const useDashboard = () => {
  // 1. Asisten meminjam "Buku Catatan Sementara" (Cache) agar kalau halamannya
  //    dibuka berulang kali, tidak membuang-buang kuota internet.
  const { data, isLoading: isCacheLoading, error: cacheError, mutate } = useFetchWithCache(endpoints.admin.dashboard);
  
  // 2. Menyiapkan kotak penyimpanan laporan (state)
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const loading = isCacheLoading;

  // 3. Jika asisten gagal mengambil laporan, catat alasan kegagalannya (Error)
  useEffect(() => {
    if (cacheError) {
      setError(cacheError.response?.data?.message || 'Terjadi kesalahan sistem saat memuat laporan.');
    }
  }, [cacheError]);

  // 4. Jika asisten berhasil pulang membawa laporan (Data), rapikan datanya!
  useEffect(() => {
    if (data) {
      setDashboardData(data.data || data);
      setError(null);
    }
  }, [data]);

  // 5. Fungsi untuk menyuruh asisten memaksa ambil laporan yang paling baru (Refresh)
  const fetchDashboardData = async () => {
    mutate(); // Merobek catatan lama agar diganti dengan data terbaru
  };

  // 6. Asisten memberikan laporan lengkapnya ke halaman Dashboard
  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
