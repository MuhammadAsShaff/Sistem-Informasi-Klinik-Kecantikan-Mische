import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil daftar jadwal reservasi dari API (READ).
 */
export function useFetchJadwal() {
  const [dataJadwal, setDataJadwal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.admin.schedules);
      if (res.data.success) {
        setDataJadwal(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    dataJadwal,
    isLoading,
    fetchSchedules,
  };
}
