import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil daftar kegiatan klinik (READ).
 */
export function useFetchKegiatan() {
  const [kegiatanList, setKegiatanList] = useState([]);

  const fetchKegiatan = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.kegiatan);
      if (res.data.success) {
        setKegiatanList(res.data.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil kegiatan:", error);
      setKegiatanList([]);
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  return { kegiatanList, fetchKegiatan };
}
