import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * ASISTEN PENGURUS BUKU DAFTAR DOKTER (useFetchDokter)
 * Ibarat asisten cekatan yang bertugas mencatat dan menyaring daftar dokter dari pusat informasi. 
 * Asisten ini bertugas memegang buku katalog dokter, menyaring nama atau keahlian saat admin 
 * mengetik di loket pencarian, serta membolak-balik halaman buku (pagination) agar meja tidak penuh.
 */
export function useFetchDokter() {
  // Posisi halaman buku yang sedang dibuka
  const [currentPage, setCurrentPage] = useState(1);
  const url = `${endpoints.admin.doctors}?page=${currentPage}`;
  
  // Mengutus kurir pencatat (useFetchWithCache) untuk menanyakan daftar dokter ke server
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(url);

  // Tempat meletakkan daftar dokter lengkap yang dikirim dari pusat
  const [dataDokter, setDataDokter] = useState([]);
  // Tempat meletakkan daftar dokter yang sudah disaring sesuai kata kunci pencarian
  const [filteredData, setFilteredData] = useState([]);
  // Tulisan di loket pencarian
  const [searchQuery, setSearchQuery] = useState("");
  // Saklar penanda kurir sedang dalam perjalanan
  const [isLoading, setIsLoading] = useState(false);

  // Mencatat jumlah halaman di dalam buku katalog
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  // Menyamakan saklar loading
  useEffect(() => {
    setIsLoading(isCacheLoading);
  }, [isCacheLoading]);

  // Saat kurir membawa map berisi daftar dokter dari pusat, rapikan di atas meja
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

  // Fungsi khusus untuk memerintahkan kurir meminta daftar dokter terbaru
  const fetchDokter = async (page = 1) => {
    setCurrentPage(page);
    mutate(); // Paksa kurir mengambil catatan baru
  };

  // PROSES PENYARINGAN KILAT SAAT ADMIN MENGETIK PENCARIAN
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataDokter.filter(
      (doc) =>
        (doc.nama && doc.nama.toLowerCase().includes(query)) ||
        (doc.email && doc.email.toLowerCase().includes(query)) ||
        (doc.deskripsi && doc.deskripsi.toLowerCase().includes(query))
    );
    setFilteredData(filtered); // Letakkan hasil saringan di meja etalase
  }, [searchQuery, dataDokter]);

  // Fungsi untuk membuka lembar halaman berikutnya
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // Asisten menyerahkan buku katalog dan seluruh alat saringnya ke mandor utama
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
