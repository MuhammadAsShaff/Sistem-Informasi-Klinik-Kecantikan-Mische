import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useFetchPublicJadwal(tanggal, idDokter) {
  const [dataJadwal, setDataJadwal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJadwal = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (tanggal) params.append("tanggal", tanggal);
      if (idDokter) params.append("idDokter", idDokter);
      const queryString = params.toString() ? `?${params.toString()}` : "";

      const res = await axiosClient.get(`${endpoints.customer.schedules}${queryString}`);
      if (res.data?.success) {
        setDataJadwal(res.data.data?.data || res.data.data); // Support for paginated or direct array
      } else if (Array.isArray(res.data)) {
        setDataJadwal(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setDataJadwal(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data jadwal publik:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [tanggal, idDokter]);

  return {
    dataJadwal,
    isLoading,
    fetchJadwal,
  };
}
