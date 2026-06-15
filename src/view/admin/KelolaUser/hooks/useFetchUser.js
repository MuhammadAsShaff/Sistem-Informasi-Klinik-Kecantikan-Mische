import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil daftar user dari API (READ + Pagination).
 */
export function useFetchUser() {
  const [dataUser, setDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${endpoints.admin.users}?page=${page}&per_page=6`);

      if (response.data?.data && Array.isArray(response.data.data.data)) {
        setDataUser(response.data.data.data);
        setCurrentPage(response.data.data.current_page || 1);
        setLastPage(response.data.data.last_page || 1);
        setStartIndex(response.data.data.from || 1);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDataUser(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDataUser(response.data);
      } else {
        setDataUser([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  return {
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchUsers,
    setCurrentPage,
    handlePageChange,
  };
}
