import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * Hook untuk mengambil daftar jadwal reservasi dari API (READ).
 */
export function useFetchJadwal() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.schedules);
  const [dataJadwal, setDataJadwal] = useState([]);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      setDataJadwal(data.data || data || []);
    }
  }, [data]);

  const fetchSchedules = async () => {
    mutate();
  };

  return {
    dataJadwal,
    isLoading,
    fetchSchedules,
  };
}
