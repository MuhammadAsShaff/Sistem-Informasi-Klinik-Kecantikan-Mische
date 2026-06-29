import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import ModalTambahDokter from "./ModalTambahDokter";
import ModalPerbaruiDokter from "./ModalPerbaruiDokter";
import ModalHapusDokter from "./ModalHapusDokter";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import Pagination from '@/components/Pagination';
import { useKelolaProfilDokter } from "../hooks/useKelolaProfilDokter";

/**
 * RUANGAN UTAMA MANAJEMEN PROFIL DOKTER (Index)
 * Ibarat sebuah ruangan besar bergaya modern tempat berkumpulnya seluruh informasi dokter. 
 * Di ruangan ini, Mandor Utama (useKelolaProfilDokter) telah menata seluruh pos kerja:
 * 1. Papan nama ruangan di sisi atas (Header).
 * 2. Loket pencarian cepat yang bersanding dengan tombol hijau tambah (+) dokter baru.
 * 3. Lemari etalase panjang (Tabel) tempat memajang foto, nama, email, dan status dokter.
 * 4. Papan penentu halaman buku (Pagination) dan bilik-bilik pop-up tersembunyi yang siap muncul saat dibutuhkan.
 */
export default function KelolaProfilDokter() {
  // Memanggil Mandor Utama yang memegang saklar pop-up, catatan dokter, dan TOA pengumuman
  const {
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    toast, setToast,
    searchQuery, setSearchQuery,
    isLoading,
    tambahDokter,
    editDokter,
    confirmDelete,
    handleEdit,
    handleDelete,
    handleStatusChange,
    currentPage, setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedDokter
  } = useKelolaProfilDokter();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- BAGIAN ATAS: PAPAN NAMA RUANGAN DAN LOKET PENCARIAN --- */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        {/* Papan Plang Nama (Header) */}
        <Header />
        
        {/* Loket Pencarian Cepat & Tombol Hijau Tambah Dokter (+) */}
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rightComponents={
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />
      </div>

      {/* --- BAGIAN TENGAH: LEMARI ETALASE TABEL DOKTER --- */}
      {isLoading ? (
        // Jika asisten sedang mengambil buku dari rak, tampilkan tulisan tunggu
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dokter...
        </div>
      ) : (
        // Memajang lemari etalase yang berisi foto, nama, email, dan tombol aksi
        <Tabel 
          isLoading={isLoading}
          data={paginatedDokter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* --- BAGIAN BAWAH: ALAT BOLAK-BALIK HALAMAN BUKU (PAGINATION) --- */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {/* --- BILIK-BILIK KOTAK POP-UP TERSEMBUNYI --- */}
      
      {/* Bilik 1: Meja Pendaftaran Dokter Baru */}
      <ModalTambahDokter
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        hook={tambahDokter}
      />

      {/* Bilik 2: Meja Formulir Koreksi Dokter Lama */}
      <ModalPerbaruiDokter
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        hook={editDokter}
      />

      {/* Bilik 3: Tanda Peringatan Pencabutan / Hapus Dokter */}
      <ModalHapusDokter
        isOpen={isHapusOpen}
        onClose={() => setIsHapusOpen(false)}
        onConfirm={() => confirmDelete(() => setIsHapusOpen(false))}
      />

      {/* --- TOA PENGUMUMAN JIKA SUKSES / GAGAL (TOAST ALERT) --- */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
