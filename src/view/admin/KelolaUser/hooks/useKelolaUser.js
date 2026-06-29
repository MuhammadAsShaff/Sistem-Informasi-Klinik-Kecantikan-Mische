import { useState } from "react";
import { useFetchUser } from "./useFetchUser";
import { useTambahUser } from "./useTambahUser";
import { useEditUser } from "./useEditUser";
import { useHapusUser } from "./useHapusUser";

/**
 * =========================================================================
 * MANDOR BESAR BALAI PENGELOLAAN KEANGGOTAAN (useKelolaUser)
 * =========================================================================
 * Ibarat mandor besar yang memimpin ruang pendaftaran dan arsip anggota klinik.
 * Mandor ini mengoordinasikan asisten pengamat (useFetchUser), asisten pendaftaran (useTambahUser),
 * juru tulis koreksi (useEditUser), dan petugas pencoret (useHapusUser).
 * Mandor juga memegang 4 kunci gembok untuk membuka bilik pendaftaran, bilik koreksi, plang pencabutan, 
 * dan bilik pameran buku profil anggota.
 */
export const useKelolaUser = () => {
  // Papan penunjuk berkas anggota mana yang sedang dipegang untuk dilihat, dikoreksi, atau dicoret
  const [selectedUser, setSelectedUser] = useState(null);

  // Gembok 1: Kunci bilik meja pendaftaran anggota baru
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  // Gembok 2: Kunci bilik meja koreksi biodata
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Gembok 3: Kunci plang peringatan pencabutan keanggotaan
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  // Gembok 4: Kunci bilik pameran buku profil detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pengendali mikrofon TOA pengumuman di atap balai
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Mempekerjakan Asisten Pengamat Papan Daftar Anggota
  const {
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchUsers,
    setCurrentPage,
    handlePageChange,
  } = useFetchUser();

  // Mempekerjakan Asisten Kurir Pendaftaran Anggota Baru
  const tambahUser = useTambahUser(
    () => { setIsTambahOpen(false); fetchUsers(currentPage); },
    showToast
  );

  // Mempekerjakan Asisten Juru Tulis Perubahan Biodata User
  const editUser = useEditUser(
    selectedUser,
    () => { setIsEditOpen(false); fetchUsers(currentPage); },
    showToast
  );

  // Mempekerjakan Petugas Pencoret Keanggotaan
  const { confirmDelete } = useHapusUser(
    selectedUser,
    currentPage,
    dataUser.length,
    fetchUsers,
    setCurrentPage,
    showToast
  );

  /**
   * TOMBOL PINTAS PEMBUKA BILIK KOREKSI
   * Ketika tombol pensil ditekan, mandor mengambil berkas anggota tersebut lalu membuka gembok bilik koreksi.
   */
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA BILIK PAMERAN BUKU PROFIL
   * Ketika ikon mata ditekan, mandor mengambil berkas anggota tersebut lalu membuka kaca pembesar profil.
   */
  const handleDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA PLANG PERINGATAN HAPUS
   * Ketika ikon tong sampah ditekan, mandor mengambil berkas anggota tersebut lalu membuka plang peringatan.
   */
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

  // Mandor menyerahkan seluruh gembok, asisten, dan laci data kepada balai agung (view)
  return {
    selectedUser,
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    isDetailOpen, setIsDetailOpen,
    toast, setToast, showToast,
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchUsers,
    setCurrentPage,
    handlePageChange,
    tambahUser,
    editUser,
    confirmDelete,
    handleEdit,
    handleDetail,
    handleDelete
  };
};
