import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useFetchPromo() {
  const [dataPromo, setDataPromo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromo = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.admin.promo);
      if (res.data) {
        const promoData = res.data.data?.data || res.data.data || res.data;
        setDataPromo(Array.isArray(promoData) ? promoData : []);
      }
    } catch (e) {
      console.error("Gagal mengambil data promo:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  // Filter berdasarkan pencarian
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataPromo.filter(
      (item) =>
        item.namaPromo?.toLowerCase().includes(query) ||
        item.kode?.toLowerCase().includes(query) ||
        item.jenisPromo?.toLowerCase().includes(query) ||
        item.nama?.toLowerCase().includes(query) || 
        item.kodePromo?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  }, [searchQuery, dataPromo]);

  return {
    dataPromo: filteredData,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchPromo,
  };
}
