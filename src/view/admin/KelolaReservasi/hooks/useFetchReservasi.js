import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

export function useFetchReservasi(page = 1) {
  const url = `${endpoints.admin.reservations}?page=${page}&per_page=6`;
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);
  
  const [dataReservasi, setDataReservasi] = useState([]);
  const [meta, setMeta] = useState(null);
  const isLoading = isCacheLoading;

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

  const fetchReservasi = async (currentPage = page) => {
    mutate();
  };

  return {
    dataReservasi,
    meta,
    isLoading,
    fetchReservasi,
  };
}
