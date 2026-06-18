import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

export function useFetchPromo() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.promo);
  const [dataPromo, setDataPromo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      const promoData = data.data || data;
      setDataPromo(Array.isArray(promoData) ? promoData : []);
    }
  }, [data]);

  const fetchPromo = async () => {
    mutate();
  };

  // Filter berdasarkan pencarian
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataPromo.filter(
      (item) =>
        (item.namaPromo?.toLowerCase() || '').includes(query) ||
        (item.kode?.toLowerCase() || '').includes(query) ||
        (item.jenisPromo?.toLowerCase() || '').includes(query) ||
        (item.nama?.toLowerCase() || '').includes(query) || 
        (item.kodePromo?.toLowerCase() || '').includes(query)
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
