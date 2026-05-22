import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useFetchDokter() {
  const [dataDokter, setDataDokter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Jika perlu paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  const fetchDokter = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${endpoints.admin.doctors}?page=${page}`);
      
      // Menyesuaikan dengan response: `response.data.data` (paginated object)
      if (response.data?.data && Array.isArray(response.data.data.data)) {
        setDataDokter(response.data.data.data);
        setCurrentPage(response.data.data.current_page || 1);
        setLastPage(response.data.data.last_page || 1);
        setStartIndex(response.data.data.from || 1);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDataDokter(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDataDokter(response.data);
      } else {
        setDataDokter([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data dokter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDokter(currentPage);
  }, [currentPage]);

  // Filter berdasarkan pencarian
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
    dataDokter: filteredData, // kembalikan data yang sudah di-filter
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
