import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useFetchMyReservasi() {
  const [myReservasi, setMyReservasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservasi = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.customer.reservations);
      if (res.data?.success) {
        setMyReservasi(res.data.data?.data || res.data.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data reservasi customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  return {
    myReservasi,
    isLoading,
    fetchReservasi,
  };
}
