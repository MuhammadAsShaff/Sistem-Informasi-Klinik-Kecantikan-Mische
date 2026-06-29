import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * ASISTEN PENGAMAT PAPAN DAFTAR ANGGOTA (useFetchUser)
 * =========================================================================
 * Ibarat asisten teliti yang bertugas di depan lemari arsip keanggotaan klinik.
 * Asisten ini membuka buku besar arsip pintar (useFetchWithCache) untuk mengambil daftar anggota,
 * menatanya rapi sebanyak 6 baris per halaman, dan siap membolak-balik halaman buku saat pimpinan meminta.
 */
export function useFetchUser() {
  // Catatan penanda halaman buku yang sedang terbuka
  const [currentPage, setCurrentPage] = useState(1);
  // Lokasi lemari arsip pusat khusus daftar anggota (dibatasi 6 baris per halaman)
  const url = `${endpoints.admin.users}?page=${currentPage}&per_page=6`;

  // Asisten mengetuk pintu gudang arsip pintar
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);

  // Laci penyimpanan baris data anggota yang siap dipajang di atas meja
  const [dataUser, setDataUser] = useState([]);
  // Catatan penanda halaman terakhir di buku arsip
  const [lastPage, setLastPage] = useState(1);
  // Catatan nomor urut anggota pertama di halaman ini
  const [startIndex, setStartIndex] = useState(1);

  // Rambu penanda asisten sedang sibuk membuka dan menyalin buku arsip
  const isLoading = isCacheLoading;

  /**
   * EFEK SAMPING: MEMILIH DAN MENYUSUN BARIS DATA KETIKA ARSIP TERBUKA
   * Begitu buku arsip terbuka (data), asisten menyalin daftar anggota, mencatat halaman terakhir, dan nomor urutnya.
   */
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

  /**
   * TUGAS MENYEGARKAN HALAMAN BUKU (fetchUsers)
   * Mandor menyuruh asisten berlari menyalin ulang data terbaru di halaman tertentu.
   */
  const fetchUsers = async (page = 1) => {
    setCurrentPage(page);
    mutate(); // Berlari mengambil lembar arsip mutakhir
  };

  /**
   * TUGAS MEMBOLAK-BALIK HALAMAN (handlePageChange)
   * Ketika pimpinan menekan nomor halaman baru, asisten membuka halaman tersebut jika memang ada.
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // Asisten menyerahkan laci data dan kemampuannya kepada mandor besar
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
