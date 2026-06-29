import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import Pagination from '@/components/Pagination';
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";
import ModalDetailUser from "./ModalDetailUser";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaUser } from "../hooks/useKelolaUser";

/**
 * BALAI AGUNG MANAJEMEN KEANGGOTAAN (KelolaUser)
 * Ibarat balai agung tempat mandor besar memantau seluruh catatan identitas dan kedudukan anggota klinik.
 * Di dalam ruangan megah ini terdapat:
 * 1. Plang Megah Sambutan (Header).
 * 2. Lensa Pembesar Pencarian & Tombol Plus (+) Pendaftaran (SearchBar).
 * 3. Meja Pameran Daftar Anggota (Tabel).
 * 4. Papan Pembalik Halaman Buku (Pagination).
 * 5. TOA Pengumuman di atap balai (ToastAlert).
 * 6. Empat bilik meja lipat pop-up rahasia (Tambah Anggota, Detail Profil, Koreksi Biodata, dan Plang Pencabutan).
 * Seluruh balai ini dipimpin langsung oleh Mandor Besar (useKelolaUser).
 */
export default function KelolaUser() {
  // Memanggil Mandor Besar untuk memegang seluruh kunci gembok, asisten, dan laci data
  const {
    selectedUser,
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    isDetailOpen, setIsDetailOpen,
    toast, setToast,
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    handlePageChange,
    tambahUser,
    editUser,
    confirmDelete,
    handleEdit,
    handleDetail,
    handleDelete
  } = useKelolaUser();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* PLANG SAMBUTAN DAN KOTAK PENCARIAN */}
      <div className="flex flex-col gap-2">
        <Header />
        <SearchBar 
          rightComponents={
            /* Tombol Plus (+) Pembuka Bilik Meja Pendaftaran Anggota Baru */
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />
      </div>

      {/* MEJA PAMERAN DAFTAR ANGGOTA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dari server...
        </div>
      ) : (
        <Tabel isLoading={isLoading} 
          data={dataUser} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onDetail={handleDetail}
          startIndex={startIndex}
        />
      )}

      {/* PAPAN PEMBALIK HALAMAN BUKU */}
      {dataUser.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={lastPage} 
          onPageChange={handlePageChange} 
        />
      )}

      {/* --- EMPAT BILIK MEJA LIPAT POP-UP RAHASIA --- */}

      {/* Bilik Meja Pendaftaran Anggota Baru */}
      <ModalTambahUser 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
        hook={tambahUser}
      />
      
      {/* Bilik Pameran Buku Profil Anggota */}
      <ModalDetailUser
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />

      {/* Bilik Meja Koreksi Biodata Anggota */}
      <ModalPerbaruiUser 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        hook={editUser}
      />

      {/* Plang Peringatan Pencabutan Keanggotaan */}
      <ModalHapusUser
        isOpen={isHapusOpen}
        onClose={() => setIsHapusOpen(false)}
        onConfirm={() => confirmDelete(() => setIsHapusOpen(false))}
      />

      {/* TOA PENGUMUMAN DI ATAP BALAI */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
