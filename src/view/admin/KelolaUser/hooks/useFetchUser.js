import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * Hook untuk mengambil daftar user dari API (READ + Pagination).
 */
export function useFetchUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const url = `${endpoints.admin.users}?page=${currentPage}&per_page=6`;

  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);

  const [dataUser, setDataUser] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      if (data.data && Array.isArray(data.data)) {
        setDataUser(data.data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
        setStartIndex(data.from || 1);
      } else if (Array.isArray(data)) {
        setDataUser(data);
      } else {
        setDataUser([]);
      }
    }
  }, [data]);

  const fetchUsers = async (page = 1) => {
    setCurrentPage(page);
    mutate();
  };

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
