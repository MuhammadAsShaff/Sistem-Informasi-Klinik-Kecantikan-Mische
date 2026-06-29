import { useState, useEffect } from 'react';
import { useFetchKategori } from './useFetchKategori';

/**
 * =========================================================================
 * PENGATUR UTAMA HALAMAN KATEGORI (Ibarat Pengatur Daftar Kategori di Toko)
 * =========================================================================
 * File ini ibarat "Pengatur Utama" di balik halaman Kategori Produk.
 * Tugasnya adalah mengambil data kategori dari server, mengurus kotak ketik pencarian,
 * mengatur nomor halaman (pagination), serta membuka dan menutup ketiga kotak pop-up
 * (Pop-up Tambah, Pop-up Perbarui/Edit, dan Pop-up Hapus).
 */
export const useKelolaKategori = () => {
  // --- PENANDA BUKA/TUTUP KOTAK POP-UP (Modal) ---
  const [isModalOpen, setIsModalOpen] = useState(false);             // Buka/tutup pop-up Tambah Kategori
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);     // Buka/tutup pop-up Perbarui/Edit Kategori
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Buka/tutup pop-up Konfirmasi Hapus
  
  // --- TEMPAT MENYIMPAN KATEGORI YANG DIPILIH ---
  const [deleteId, setDeleteId] = useState(null);               // Menyimpan ID kategori yang mau dihapus
  const [selectedCategory, setSelectedCategory] = useState(null); // Menyimpan data kategori yang mau diedit
  
  // --- KOTAK ISIAN PENCARIAN ---
  const [searchQuery, setSearchQuery] = useState('');           // Tulisan di kotak pencarian
  
  // --- MENGAMBIL DAFTAR KATEGORI DARI SERVER ---
  const { categories, refetch, isLoading } = useFetchKategori();

  // --- KOTAK PESAN NOTIFIKASI KECIL DI POJOK LAYAR (Toast) ---
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  
  /*
    FUNGSI MENAMPILKAN PESAN NOTIFIKASI (showToast):
    Untuk memunculkan pesan berhasil ('success') atau gagal ('error') di sudut layar.
  */
  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  /*
    PROSES PENYARINGAN KATEGORI (filteredCategories):
    Menyaring daftar kategori berdasarkan apa yang diketik admin di kotak pencarian.
  */
  const filteredCategories = categories.filter(category =>
    (category.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (category.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // =========================================================================
  // PENGATUR HALAMAN PEMBAGI DATA (Pagination)
  // =========================================================================
  const [currentPage, setCurrentPage] = useState(1); // Halaman yang sedang aktif saat ini
  const ITEMS_PER_PAGE = 6;                          // Batas jumlah kategori per halaman (6 item)
  // Menghitung total keseluruhan halaman
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  /*
    JIKA PENGGUNA MENGGUNAKAN KOTAK PENCARIAN (useEffect):
    Otomatis kembalikan posisi halaman ke angka 1.
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /*
    MEMOTONG DAFTAR KATEGORI PER HALAMAN (paginatedCategories):
    Mengambil daftar kategori tersaring, lalu memotongnya sebanyak 6 item per halaman.
  */
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /*
    FUNGSI SAAT TOMBOL HAPUS DITEKAN (handleDeleteClick):
    Menyimpan ID kategori ke dalam 'deleteId', lalu membuka kotak pop-up konfirmasi hapus.
  */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  /*
    FUNGSI SAAT TOMBOL EDIT DITEKAN (handleEditClick):
    Menyimpan data kategori ke dalam 'selectedCategory', lalu membuka kotak pop-up perbarui.
  */
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Mengirimkan seluruh data dan fungsi ini ke halaman antarmuka (Index.jsx) agar bisa digunakan
  return {
    isLoading,
    refetch,
    searchQuery, setSearchQuery,
    paginatedCategories,
    currentPage, setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isModalOpen, setIsModalOpen,
    isEditModalOpen, setIsEditModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    deleteId,
    selectedCategory,
    toast, setToast, showToast,
    handleDeleteClick,
    handleEditClick
  };
};
