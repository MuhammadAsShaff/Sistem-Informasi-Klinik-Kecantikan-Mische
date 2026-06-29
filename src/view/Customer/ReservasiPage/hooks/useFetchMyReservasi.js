import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * MANDOR PEMERIKSA ARSIP DAFTAR JADWAL SAYA (useFetchMyReservasi)
 * =========================================================================
 * Ibarat asisten pengecek rak pesanan di ruang administrasi yang dengan sigap
 * mengambil daftar reservasi lama milik tamu agar bisa langsung dibaca tanpa menunggu lama.
 */
export function useFetchMyReservasi() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.customer.reservations);
  const [myReservasi, setMyReservasi] = useState([]);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      setMyReservasi(data.data?.data || data.data || []);
    }
  }, [data]);

  const fetchReservasi = async () => {
    mutate();
  };

  return {
    myReservasi,
    isLoading,
    fetchReservasi,
  };
}
