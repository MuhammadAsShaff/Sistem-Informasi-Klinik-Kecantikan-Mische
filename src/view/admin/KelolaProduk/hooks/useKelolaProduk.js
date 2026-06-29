import { useState, useEffect } from 'react';
import { useFetchProduk } from './useFetchProduk';
import { useUpdateStok } from './useUpdateStok';

/**
 * MANDOR PENGATUR UTAMA KELOLA PRODUK (useKelolaProduk)
 * Ini adalah otak penggerak dari halaman Kelola Produk. Mandor ini bertugas mengoordinasikan 
 * pembukaan kotak pop-up (tambah, edit, hapus, detail), mengatur fungsi pencarian barang, 
 * membagi tabel menjadi beberapa halaman (pagination), serta menampilkan pesan pemberitahuan (toast).
 */
export const useKelolaProduk = () => {
  // 1. DAFTAR SAKLAR UNTUK MEMBUKA/MENUTUP KOTAK JENDELA (MODAL)
  const [isModalOpen, setIsModalOpen] = useState(false); // Saklar pembuka formulir Tambah Produk
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Saklar pembuka formulir Edit Produk
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Saklar pembuka pop-up Konfirmasi Hapus
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Saklar pembuka pop-up Detail Informasi Lengkap
  
  // 2. TEMPAT MENYIMPAN INFORMASI BARANG YANG SEDANG DIPILIH
  const [deleteId, setDeleteId] = useState(null); // Catatan kode ID barang yang akan dihapus
  const [selectedCategory, setSelectedCategory] = useState(null); // Catatan data barang yang akan diedit
  const [selectedDetailCategory, setSelectedDetailCategory] = useState(null); // Catatan data barang yang akan dilihat detailnya
  const [searchQuery, setSearchQuery] = useState(''); // Kolom isian kata kunci pencarian
  
  // 3. MEMANGGIL ASISTEN-ASISTEN KHUSUS
  // - Asisten pengambil daftar produk dari gudang pusat
  const { products, refetch, updateLocalStock, isLoading } = useFetchProduk();
  // - Asisten pencatat perubahan angka stok barang
  const { updateStok } = useUpdateStok(updateLocalStock);

  // 4. SISTEM PEMBERITAHUAN (TOAST ALERT)
  // Ibarat TOA pengumuman singkat yang berbunyi "Berhasil disimpan!" atau "Gagal!"
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // 5. PENYARING KATALOG BERDASARKAN KATA KUNCI PENCARIAN
  // Mencari kesamaan teks pada nama produk, deskripsi, ataupun nama kategori
  const filteredCategories = products.filter(product =>
    (product.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.kategori?.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // 6. MEMBAGI TABEL MENJADI BEBERAPA HALAMAN (PAGINATION)
  // Agar meja tidak penuh, kita hanya memajang 6 barang per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  // Jika admin mengetik sesuatu di kotak pencarian, otomatis buka kembali halaman pertama
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Mengambil jatah 6 barang khusus untuk halaman yang sedang aktif
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- FUNGSI-FUNGSI SAAT TOMBOL DI TABEL DITEKAN ---

  // Saat tombol tempat sampah ditekan: catat ID-nya, lalu buka jendela konfirmasi hapus
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Saat tombol pensil (edit) ditekan: salin seluruh data barang, lalu buka formulir edit
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Saat tombol mata (detail) ditekan: salin seluruh data barang, lalu buka jendela informasi detail
  const handleDetailClick = (category) => {
    setSelectedDetailCategory(category);
    setIsDetailModalOpen(true);
  };

  // Semua kendali dan catatan ini dibagikan ke halaman tampilan utama
  return {
    isLoading,
    refetch,
    updateStok,
    searchQuery,
    setSearchQuery,
    paginatedCategories,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    deleteId,
    selectedCategory,
    selectedDetailCategory,
    toast,
    setToast,
    showToast,
    handleDeleteClick,
    handleEditClick,
    handleDetailClick
  };
};
