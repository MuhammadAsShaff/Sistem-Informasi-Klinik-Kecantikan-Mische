import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useFetchReservasi(page = 1) {
  const [dataReservasi, setDataReservasi] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservasi = async (currentPage = page) => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(`${endpoints.admin.reservations}?page=${currentPage}`);
      if (res.data.success) {
        // Jika response dibungkus paginate() Laravel, bentuknya data.data.data dan data.data (untuk meta)
        const responseData = res.data.data;
        
        if (responseData && responseData.data) {
          setDataReservasi(responseData.data);
          setMeta({
            current_page: responseData.current_page,
            last_page: responseData.last_page,
            total: responseData.total,
            from: responseData.from,
            to: responseData.to,
          });
        } else {
          setDataReservasi(responseData || []);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data reservasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservasi(page);
  }, [page]);

  return {
    dataReservasi,
    meta,
    isLoading,
    fetchReservasi,
  };
}
