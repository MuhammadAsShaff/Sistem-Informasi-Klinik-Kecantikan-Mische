import { useState, useEffect } from "react";
import { useFetchTestimoni } from "./useFetchTestimoni";

/**
 * =========================================================================
 * MANDOR BESAR BALAI PENGELOLAAN TESTIMONI (useKelolaTestimoni)
 * =========================================================================
 * Ibarat mandor besar yang memimpin ruang mading ulasan klinik. Mandor ini mengoordinasikan asisten pengamat 
 * (useFetchTestimoni) untuk memajang pujian pelanggan di etalase.
 * Mandor juga memegang 3 kunci gembok untuk membuka bilik meja pendaftaran, bilik koreksi, dan plang pencopotan,
 * serta memandu asisten pembalik halaman buku (6 ulasan per halaman).
 */
export const useKelolaTestimoni = () => {
  // Gembok 1: Kunci bilik meja pendaftaran testimoni baru
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  // Gembok 2: Kunci bilik meja perbaikan ulasan lama
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Gembok 3: Kunci plang peringatan pencopotan ulasan
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  
  // Papan penunjuk berkas ulasan mana yang sedang dipegang untuk dikoreksi atau dicopot
  const [selectedData, setSelectedData] = useState(null);
  
  // Pengendali mikrofon TOA pengumuman di atap balai
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Kotak ketikan tempat pimpinan mencari nama pelanggan, kalimat pujian, atau jenis testimoni
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mempekerjakan Asisten Pengamat Papan Pujian
  const { testimoni, isLoading, refetch } = useFetchTestimoni();

  // Mandor menyaring mandiri daftar ulasan berdasarkan ketikan di kotak pencarian
  const filteredTestimoni = testimoni.filter(item => 
    (item.namaTester?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.deskripsi?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.jenisTestimoni?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Catatan halaman buku etalase (6 ulasan per halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredTestimoni.length / ITEMS_PER_PAGE);

  /**
   * EFEK SAMPING: MEMBUKA HALAMAN PERTAMA SAAT KATA KUNCI BERUBAH
   * Begitu pimpinan mengetik sesuatu di kotak cari, mandor langsung membuka halaman pertama buku etalase.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Asisten memotong daftar ulasan agar pas di atas meja pameran (6 baris saja)
  const paginatedTestimoni = filteredTestimoni.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * TOMBOL PINTAS PEMBUKA BILIK KOREKSI
   * Ketika tombol pensil ditekan, mandor mengambil berkas ulasan tersebut lalu membuka gembok bilik koreksi.
   */
  const handleEdit = (item) => {
    setSelectedData(item);
    setIsEditOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA PLANG PERINGATAN HAPUS
   * Ketika ikon tong sampah ditekan, mandor mengambil berkas ulasan tersebut lalu membuka plang peringatan.
   */
  const handleDelete = (item) => {
    setSelectedData(item);
    setIsHapusOpen(true);
  };

  // Mandor menyerahkan seluruh gembok, laci data, dan asisten kepada balai agung (view)
  return {
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    selectedData, setSelectedData,
    toast, setToast, showToast,
    searchTerm, setSearchTerm,
    isLoading,
    refetch,
    currentPage, setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedTestimoni,
    handleEdit,
    handleDelete
  };
};
