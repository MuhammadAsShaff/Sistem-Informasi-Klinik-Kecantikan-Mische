import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * ASISTEN PENGAMAT PAPAN PUJIAN (useFetchTestimoni)
 * =========================================================================
 * Ibarat asisten tekun yang berjaga di depan papan mading tempat menempel ulasan pelanggan.
 * Asisten ini membuka buku besar arsip pintar (useFetchWithCache) untuk mengambil seluruh lembar ulasan,
 * lalu menatanya di laci meja agar siap dipamerkan di etalase klinik.
 */
export function useFetchTestimoni() {
  // Mengetuk pintu gudang arsip pintar untuk meminta seluruh lembar testimoni
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.testimonials);
  
  // Laci penyimpanan khusus lembaran ulasan yang sudah diverifikasi
  const [testimoni, setTestimoni] = useState([]);
  // Rambu penanda asisten sedang membuka dan menyalin buku arsip
  const isLoading = isCacheLoading;

  /**
   * EFEK SAMPING: MENYUSUN LEMBARAN KETIKA BUKU ARSIP SELESAI DIBUKA
   * Begitu buku arsip terbuka (data), asisten menyusun lembaran ulasan tersebut ke dalam laci.
   */
  useEffect(() => {
    if (data) {
      const testData = data.data || data;
      setTestimoni(Array.isArray(testData) ? testData : []);
    }
  }, [data]);

  /**
   * TUGAS MENYEGARKAN PAPAN PUJIAN (fetchTestimoni)
   * Titah khusus dari mandor kepada asisten untuk berlari mengambil lembar pujian terbaru (mutate).
   */
  const fetchTestimoni = async () => {
    mutate();
  };

  // Asisten menyerahkan laci ulasan dan kemampuannya kepada mandor besar
  return { testimoni, isLoading, refetch: fetchTestimoni };
}
