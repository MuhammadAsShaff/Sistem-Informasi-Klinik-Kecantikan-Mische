import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

export function useFetchDokter() {
  const [currentPage, setCurrentPage] = useState(1);
  const url = `${endpoints.admin.doctors}?page=${currentPage}`;
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);

  const [dataDokter, setDataDokter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = isCacheLoading;

  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  useEffect(() => {
    if (data) {
      if (data.data && Array.isArray(data.data)) {
        setDataDokter(data.data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
        setStartIndex(data.from || 1);
      } else if (Array.isArray(data)) {
        setDataDokter(data);
      } else {
        setDataDokter([]);
      }
    }
  }, [data]);

  const fetchDokter = async (page = 1) => {
    setCurrentPage(page);
    mutate();
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataDokter.filter(
      (doc) =>
        (doc.nama && doc.nama.toLowerCase().includes(query)) ||
        (doc.email && doc.email.toLowerCase().includes(query)) ||
        (doc.deskripsi && doc.deskripsi.toLowerCase().includes(query))
    );
    setFilteredData(filtered);
  }, [searchQuery, dataDokter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  return {
    dataDokter: filteredData,
    searchQuery,
    setSearchQuery,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchDokter,
    setCurrentPage,
    handlePageChange,
  };
}
