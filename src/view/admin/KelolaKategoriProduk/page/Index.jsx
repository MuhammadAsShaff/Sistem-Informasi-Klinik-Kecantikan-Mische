import React from 'react';
// Mengimpor papan nama judul halaman
import HeaderSection from './HeaderSection';
// Mengimpor kotak isian pencarian
import SearchBar from '@/components/SearchBar';
// Mengimpor ikon simbol tambah (+)
import { Plus } from 'lucide-react';
// Mengimpor tabel daftar kategori
import TableSection from './TableSection';
// Mengimpor kotak pop-up tambah kategori baru
import ModalTambahKategori from './ModalTambahKategori';
// Mengimpor kotak pop-up perbarui/edit kategori
import ModalPerbaruiKategori from './ModalPerbaruiKategori';
// Mengimpor kotak pop-up konfirmasi hapus
import ModalHapusKategori from './ModalHapusKategori';
// Mengimpor pengatur tombol halaman (pagination)
import Pagination from '@/components/Pagination';
// Mengimpor kotak notifikasi di sudut layar (Toast)
import ToastAlert from '@/view/components/ToastAlert/page/Index';
// Mengimpor pengatur utama halaman kategori
import { useKelolaKategori } from '../hooks/useKelolaKategori';

/**
 * =========================================================================
 * HALAMAN UTAMA KATEGORI PRODUK (Ibarat Tampilan Buku Kategori di Toko)
 * =========================================================================
 * File ini ibarat "Tampilan Meja Kasir Utama" untuk mengatur kategori produk.
 * Di sini menyatukan semua perlengkapan: papan judul, kotak pencarian, tombol tambah,
 * tabel daftar kategori, tombol pindah halaman, serta ketiga kotak pop-up.
 */
const KelolaKategoriProduk = () => {
  // 1. MEMANGGIL PENGATUR UTAMA UNTUK MENGAMBIL DATA DAN FUNGSI
  const {
    isLoading,         // Penanda loading saat mengambil data
    refetch,           // Fungsi menyegarkan tabel
    searchQuery,       // Tulisan di kotak pencarian
    setSearchQuery,    // Fungsi mengubah tulisan pencarian
    paginatedCategories, // Daftar kategori yang sudah dipotong per halaman
    currentPage,       // Halaman aktif saat ini
    setCurrentPage,    // Fungsi memindah halaman
    totalPages,        // Total seluruh halaman
    ITEMS_PER_PAGE,    // Batas 6 kategori per halaman
    isModalOpen,       // Penanda buka/tutup pop-up tambah
    setIsModalOpen,    // Fungsi membuka/menutup pop-up tambah
    isEditModalOpen,   // Penanda buka/tutup pop-up perbarui/edit
    setIsEditModalOpen, // Fungsi membuka/menutup pop-up perbarui/edit
    isDeleteModalOpen, // Penanda buka/tutup pop-up hapus
    setIsDeleteModalOpen, // Fungsi membuka/menutup pop-up hapus
    deleteId,          // ID kategori yang mau dihapus
    selectedCategory,  // Data kategori yang mau diedit
    toast,             // Pengatur pesan notifikasi
    setToast,          // Fungsi menutup/membuka notifikasi
    showToast,         // Fungsi memunculkan notifikasi
    handleDeleteClick, // Fungsi saat tombol hapus diklik
    handleEditClick    // Fungsi saat tombol edit diklik
  } = useKelolaKategori();

  return (
    // Kotak utama halaman dengan latar abu-abu sejuk dan efek muncul perlahan
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. PAPAN NAMA JUDUL HALAMAN */}
      <HeaderSection />
      
      {/* 2. KOTAK KETIK PENCARIAN & TOMBOL TAMBAH HIJAU */}
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        rightComponents={
          // Tombol hijau untuk membuka kotak pop-up Tambah Kategori
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={20} />
          </button>
        }
      />
      
      {/* 3. TABEL DAFTAR KATEGORI */}
      <TableSection 
        isLoading={isLoading} 
        categories={paginatedCategories} 
        onDeleteClick={handleDeleteClick} 
        onEditClick={handleEditClick}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      {/* 4. TOMBOL PINDAH HALAMAN (Pagination) */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      
      {/* ========================================================================= */}
      {/* KOTAK-KOTAK POP-UP (Modal) */}
      {/* ========================================================================= */}
      
      {/* Pop-up 1: Kotak Tambah Kategori Baru */}
      <ModalTambahKategori 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refetch={refetch}
        showToast={showToast}
      />

      {/* Pop-up 2: Kotak Perbarui/Edit Kategori */}
      <ModalPerbaruiKategori 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoryData={selectedCategory}
        refetch={refetch}
        showToast={showToast}
      />

      {/* Pop-up 3: Kotak Konfirmasi Hapus */}
      <ModalHapusKategori 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        dataId={deleteId}
        refetch={refetch}
        showToast={showToast}
      />

      {/* 5. KOTAK NOTIFIKASI DI SUDUT LAYAR (Toast Alert) */}
      <ToastAlert 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default KelolaKategoriProduk;
