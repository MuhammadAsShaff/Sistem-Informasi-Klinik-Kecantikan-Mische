import React from 'react';
import HeaderSection from './HeaderSection';
import SearchBar from '@/components/SearchBar';
import { Plus } from 'lucide-react';
import TableSection from './TableSection';
import ModalTambahProduk from './ModalTambahProduk';
import ModalPerbaruiProduk from './ModalPerbaruiProduk';
import ModalHapusProduk from './ModalHapusProduk';
import ModalDetailProduk from './ModalDetailProduk';
import Pagination from '@/components/Pagination';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import { useKelolaProduk } from '../hooks/useKelolaProduk';

/**
 * RUANGAN UTAMA KELOLA PRODUK (Index)
 * Ibarat aula besar tempat seluruh komponen pengelolaan produk dipajang. Di dalam ruangan ini terdapat 
 * papan judul utama, meja kasir untuk mencari barang, lemari etalase (tabel) yang memajang produk, 
 * tombol untuk berpindah halaman, serta berbagai bilik rahasia (kotak pop-up) yang baru akan terbuka 
 * saat tombol tambah, edit, detail, atau hapus ditekan.
 */
const KelolaProduk = () => {
  // Memanggil Mandor Utama yang mengatur semua fungsi, saklar, dan data di dalam ruangan ini
  const {
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
  } = useKelolaProduk();

  return (
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. PAPAN JUDUL UTAMA DI ATAS RUANGAN */}
      <HeaderSection />
      
      {/* 2. BARIS PENCARIAN & TOMBOL TAMBAH PRODUK BARU */}
      {/* Ibarat meja loket tempat admin bisa mengetik nama barang atau menekan tombol hijau (+) */}
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        rightComponents={
          <button 
            onClick={() => setIsModalOpen(true)} // Buka saklar formulir Tambah Produk
            className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={20} />
          </button>
        }
      />

      {/* 3. LEMARI ETALASE TABEL PRODUK */}
      {/* Tempat memajang daftar produk, foto, harga, dan tombol-tombol operasi (tambah stok, edit, hapus, detail) */}
      <TableSection 
        isLoading={isLoading} 
        categories={paginatedCategories} 
        onDeleteClick={handleDeleteClick} 
        onEditClick={handleEditClick}
        onDetailClick={handleDetailClick}
        onUpdateStock={updateStok}
        showToast={showToast}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      {/* 4. TOMBOL PINDAH HALAMAN (PAGINATION) */}
      {/* Ibarat penomoran laci tabel, agar admin bisa berpindah dari halaman 1, 2, 3, dan seterusnya */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      
      {/* --- KELOMPOK BILIK JENDELA POP-UP (MODAL) --- */}
      {/* Semua kotak ini tersembunyi dan baru muncul jika saklar pembukanya dinyalakan oleh Mandor */}
      
      {/* Formulir Pendaftaran Produk Baru */}
      <ModalTambahProduk 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refetch={refetch}
        showToast={showToast}
      />

      {/* Formulir Edit/Perbarui Produk Lama */}
      <ModalPerbaruiProduk 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoryData={selectedCategory}
        refetch={refetch}
        showToast={showToast}
      />

      {/* Kotak Konfirmasi Sebelum Menghapus Produk */}
      <ModalHapusProduk 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        dataId={deleteId}
        refetch={refetch}
        showToast={showToast}
      />
      
      {/* Kotak Tampilan Informasi Detail Lengkap Produk */}
      <ModalDetailProduk
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedDetailCategory}
      />

      {/* TOA PENGUMUMAN (TOAST ALERT) */}
      {/* Muncul sesaat di pojok layar untuk menyampaikan pengumuman sukses/gagal */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default KelolaProduk;
