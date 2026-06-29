import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * ASISTEN PENJAGA DAFTAR ANTREAN RESERVASI (useFetchReservasi)
 * =========================================================================
 * Ibarat asisten pengamat di lobi klinik yang tekun memantau buku antrean tamu.
 * Tugas utama asisten ini meliputi:
 * 1. Mengetuk pintu gudang arsip pintar (useFetchWithCache) untuk mengambil daftar tamu per halaman (6 orang per lembar).
 * 2. Mencatat nomor lembar halaman saat ini, total lembaran, dan menyusunnya rapi di atas meja.
 * 3. Memberi tanda isyarat (isLoading) jika buku arsip sedang dibuka.
 */
export function useFetchReservasi(page = 1) {
  // Alamat rak buku arsip khusus antrean tamu beserta nomor halamannya
  const url = `${endpoints.admin.reservations}?page=${page}&per_page=6`;
  // Membuka buku arsip pintar yang memiliki ingatan kuat
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);
  
  // Laci penyimpanan khusus nama-nama tamu yang sudah disalin
  const [dataReservasi, setDataReservasi] = useState([]);
  // Papan info rekapitulasi halaman (contoh: halaman 1 dari 5, total 30 tamu)
  const [meta, setMeta] = useState(null);
  // Rambu penanda asisten sedang sibuk menyalin buku tamu
  const isLoading = isCacheLoading;

  /**
   * EFEK SAMPING: MENYALIN DATA KETIKA BUKU ARSIP SELESAI DIBUKA
   * Begitu buku arsip terbuka, asisten memilah bagian daftar nama (data.data) 
   * dan menyalin catatan rekap halaman (current_page, last_page) ke papan info.
   */
  useEffect(() => {
    if (data) {
      if (data && data.data && Array.isArray(data.data)) {
        setDataReservasi(data.data);
        setMeta({
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
        });
      } else {
        setDataReservasi(data || []);
      }
    }
  }, [data]);

  /**
   * TUGAS MENYEGARKAN DAFTAR ANTREAN (fetchReservasi)
   * Titah khusus dari mandor kepada asisten untuk berlari ke gudang dan mengambil data antrean terbaru (mutate).
   */
  const fetchReservasi = async (currentPage = page) => {
    mutate();
  };

  // Asisten menyerahkan laci antrean dan papan info halaman kepada mandor
  return {
    dataReservasi,
    meta,
    isLoading,
    fetchReservasi,
  };
}
