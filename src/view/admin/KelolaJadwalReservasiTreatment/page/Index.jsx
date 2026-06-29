import React from "react";
// Mengimpor papan judul halaman
import Header from "./Header";
// Mengimpor kotak ketik pencarian
import SearchBar from '@/components/SearchBar';
// Mengimpor lambang simbol tambah (+)
import { Plus } from "lucide-react";
// Mengimpor tabel daftar jadwal
import Tabel from "./Tabel";
// Mengimpor pengatur tombol halaman (pagination)
import Pagination from '@/components/Pagination';
// Mengimpor kotak pop-up tambah jadwal baru
import ModalTambahJadwal from "./ModalTambahJadwal";
// Mengimpor kotak pop-up perbarui/edit jadwal
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
// Mengimpor kotak pop-up konfirmasi hapus
import ModalHapusJadwal from "./ModalHapusJadwal";
// Mengimpor kotak notifikasi di sudut layar (Toast)
import ToastAlert from "@/view/components/ToastAlert/page/Index";
// Mengimpor pengatur utama halaman jadwal
import { useKelolaJadwal } from "../hooks/useKelolaJadwal";

/**
 * =========================================================================
 * HALAMAN UTAMA KELOLA JADWAL (Ibarat Tampilan Papan Utama di Toko)
 * =========================================================================
 * File ini ibarat "Meja Pengatur Utama" untuk mengelola jadwal dokter.
 * Di sinilah seluruh bagian disatukan: papan judul, kotak pencarian, tombol tambah,
 * tabel daftar jadwal, tombol pindah halaman, serta ketiga kotak pop-up.
 */
export default function KelolaJadwalReservasiTreatment() {
  // =========================================================================
  // MEMANGGIL PENGATUR UTAMA UNTUK MENGAMBIL DATA DAN FUNGSI
  // =========================================================================
  const {
    isLoading,       // Penanda loading saat mengambil data dari server
    paginatedJadwal, // Daftar jadwal yang sudah dipotong per halaman
    currentPage,     // Halaman aktif saat ini
    setCurrentPage,  // Fungsi untuk berpindah halaman
    totalPages,      // Total seluruh halaman
    ITEMS_PER_PAGE,  // Batas maksimal 6 jadwal per halaman
    isTambahOpen,    // Penanda buka/tutup pop-up tambah
    setIsTambahOpen, // Fungsi membuka/menutup pop-up tambah
    isEditOpen,      // Penanda buka/tutup pop-up perbarui/edit
    setIsEditOpen,   // Fungsi membuka/menutup pop-up perbarui/edit
    isHapusOpen,     // Penanda buka/tutup pop-up hapus
    setIsHapusOpen,  // Fungsi membuka/menutup pop-up hapus
    toast,           // Pengatur pesan notifikasi
    setToast,        // Fungsi menutup/membuka notifikasi
    tambahJadwal,    // Pengatur khusus pop-up tambah jadwal
    editJadwal,      // Pengatur khusus pop-up perbarui/edit
    hapusJadwal,     // Pengatur khusus pop-up hapus
    handleEdit,      // Fungsi saat tombol edit diklik
    handleDelete     // Fungsi saat tombol hapus diklik
  } = useKelolaJadwal();

  return (
    /*
      KOTAK UTAMA HALAMAN:
      - 'p-8 bg-[#F8F9FA] min-h-screen': Memakai latar abu-abu sejuk yang bersih dan memenuhi tinggi layar.
      - 'animate-in fade-in duration-700': Efek muncul perlahan saat halaman dibuka agar tampak halus.
    */
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      
      {/* 
        KOTAK NOTIFIKASI DI SUDUT LAYAR (TOAST ALERT):
        Jika ada pesan sukses atau gagal, tampilkan kotak notifikasi melayang di sudut layar.
      */}
      {toast && toast.isOpen && (
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}

      {/* Pembungkus tengah agar letak tabel dan pencarian berada pas di tengah layar */}
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        
        {/* 1. PAPAN JUDUL HALAMAN */}
        <Header />

        {/* 
          2. KOTAK KETIK PENCARIAN & TOMBOL TAMBAH HIJAU
          Di bagian kanan kotak pencarian, ada tombol hijau cerah (`bg-[#56BC36]`).
          Begitu ditekan (`onClick`), tombol ini membuka kotak pop-up Tambah Jadwal Baru!
        */}
        <SearchBar 
          rightComponents={
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />

        {/* 
          3. TABEL DAFTAR JADWAL
          Jika sistem sedang mengambil data (isLoading = true), tampilkan tulisan "Mengambil data dari server...".
          Jika selesai, tampilkan tabel jadwal beserta isinya.
        */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
            Mengambil data dari server...
          </div>
        ) : (
          <Tabel 
            isLoading={isLoading}
            data={paginatedJadwal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        {/* 4. TOMBOL PINDAH HALAMAN (PAGINATION) */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />

        {/* ========================================================================= */}
        {/* 5. KOTAK-KOTAK POP-UP (MODAL) */}
        {/* ========================================================================= */}
        
        {/* Pop-up 1: Kotak Tambah Jadwal Baru */}
        <ModalTambahJadwal
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          hook={tambahJadwal}
        />

        {/* Pop-up 2: Kotak Perbarui/Edit Jadwal */}
        <ModalPerbaruiJadwal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          hook={editJadwal}
        />

        {/* Pop-up 3: Kotak Konfirmasi Hapus Jadwal */}
        <ModalHapusJadwal
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          hook={hapusJadwal}
        />

      </div>
    </div>
  );
}
