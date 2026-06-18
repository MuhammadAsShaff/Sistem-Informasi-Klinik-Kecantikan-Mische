import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * Hook untuk mengambil daftar kegiatan klinik (READ).
 */
export function useFetchKegiatan() {
  const { data, mutate } = useFetchWithCache(endpoints.admin.kegiatan);
  const [kegiatanList, setKegiatanList] = useState([]);

  useEffect(() => {
    if (data) {
      setKegiatanList(data.data || data || []);
    }
  }, [data]);

  const fetchKegiatan = async () => {
    mutate();
  };

  return { kegiatanList, fetchKegiatan };
}
