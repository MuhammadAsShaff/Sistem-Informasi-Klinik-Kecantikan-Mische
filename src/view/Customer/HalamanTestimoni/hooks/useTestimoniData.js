import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * MANDOR PENGARSIP KISAH PASIEN (useTestimoniData)
 * =========================================================================
 * Ibarat mandor pencatat buku emas di meja lobi utama klinik:
 * 1. Mengambil seluruh arsip ulasan dan foto bukti puas dari laci kasir pusat (FetchWithCache).
 * 2. Menyalin catatan tersebut ke dalam formulir standar bersampul seragam (id, name, description, foto) agar mudah dipasang di dinding mading.
 */
export const useTestimoniData = () => {
  const { data, isLoading } = useFetchWithCache(endpoints.customer.testimonials);

  const rawData = data?.data || data || [];
  const dataArray = Array.isArray(rawData) ? rawData : [];
  
  // Map backend format to component props format
  const testimonials = dataArray.map(item => ({
    id: item.idTestimoni || item.id,
    name: item.namaTester,
    description: item.deskripsi,
    foto: item.buktiFoto
  }));

  return {
    testimonials,
    isLoading
  };
};
