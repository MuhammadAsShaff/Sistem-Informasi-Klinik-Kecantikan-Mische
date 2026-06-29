import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * ASISTEN PENGAMAT ETALASE PROMO (useFetchPromo)
 * =========================================================================
 * Ibarat asisten pengamat yang tekun bertugas memonitor seluruh promo yang aktif di klinik.
 * Tugas utama asisten ini meliputi:
 * 1. Mengambil daftar promo dari buku arsip pintar (useFetchWithCache) yang punya ingatan kuat.
 * 2. Memegang kotak pencarian untuk menyaring promo berdasarkan nama, kode, atau jenisnya.
 * 3. Menyuguhkan hasil saringan yang bersih kepada mandor untuk ditampilkan di tabel.
 */
export function useFetchPromo() {
  // Asisten mengambil data dari buku arsip pintar
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.promo);
  // Laci penyimpanan seluruh promo yang berhasil disalin dari buku arsip
  const [dataPromo, setDataPromo] = useState([]);
  // Laci pajangan khusus promo yang lolos penyaringan kata kunci
  const [filteredData, setFilteredData] = useState([]);
  // Kotak ketikan tempat admin memasukkan kata kunci pencarian
  const [searchQuery, setSearchQuery] = useState("");
  // Rambu penanda asisten sedang menunggu buku arsip terbuka
  const isLoading = isCacheLoading;

  /**
   * EFEK SAMPING: MEMINDAHKAN BUKU ARSIP KE LACI MEJA
   * Begitu buku arsip pintar selesai dibuka, asisten menyalin seluruh isinya ke laci meja (dataPromo).
   */
  useEffect(() => {
    if (data) {
      const promoData = data.data || data;
      setDataPromo(Array.isArray(promoData) ? promoData : []);
    }
  }, [data]);

  /**
   * TUGAS MENYEGARKAN INGATAN (fetchPromo)
   * Perintah khusus kepada asisten untuk berlari ke gudang dan mengambil data terbaru (mutate).
   */
  const fetchPromo = async () => {
    mutate();
  };

  /**
   * EFEK SAMPING: MENYARING DATA SAAT KATA KUNCI DIKETIK
   * Setiap kali admin mengetikkan huruf di kotak pencarian, asisten langsung menyeleksi promo 
   * yang nama, kode, atau jenisnya cocok dengan ketikan tersebut.
   */
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataPromo.filter(
      (item) =>
        (item.namaPromo?.toLowerCase() || '').includes(query) ||
        (item.kode?.toLowerCase() || '').includes(query) ||
        (item.jenisPromo?.toLowerCase() || '').includes(query) ||
        (item.nama?.toLowerCase() || '').includes(query) || 
        (item.kodePromo?.toLowerCase() || '').includes(query)
    );
    setFilteredData(filtered); // Menyimpan hasil seleksi ke laci pajangan
  }, [searchQuery, dataPromo]);

  // Asisten menyerahkan laci pajangan dan saklar pencarian kepada mandor
  return {
    dataPromo: filteredData,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchPromo,
  };
}
