import { useState, useEffect } from "react";
import { useFetchDokter } from "./useFetchDokter";
import { useTambahDokter } from "./useTambahDokter";
import { useEditDokter } from "./useEditDokter";
import { useHapusDokter } from "./useHapusDokter";

/**
 * MANDOR PENGATUR UTAMA PROFIL DOKTER (useKelolaProfilDokter)
 * Ibarat mandor kepala yang memimpin seluruh ruangan manajemen dokter. Mandor ini bertugas:
 * 1. Memegang saklar untuk membuka/menutup jendela pop-up (Tambah, Edit, Hapus).
 * 2. Mengkoordinasikan seluruh asisten (Asisten Buku, Juru Tulis Pendaftaran, Juru Tulis Koreksi, & Eksekutor).
 * 3. Memegang TOA pengumuman (Toast) serta membagi tumpukan daftar dokter ke beberapa halaman (Pagination).
 */
export const useKelolaProfilDokter = () => {
  // Catatan dokter mana yang sedang dipilih/disorot admin
  const [selectedDokter, setSelectedDokter] = useState(null);
  
  // Saklar pembuka jendela pop-up formulir & peringatan
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  
  // TOA Pengumuman (Toast Alert)
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // 1. MEMANGGIL ASISTEN BUKU DAFTAR DOKTER (useFetchDokter)
  const {
    dataDokter,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchDokter,
  } = useFetchDokter();

  // 2. MEMANGGIL JURU TULIS PENDAFTARAN DOKTER BARU (useTambahDokter)
  const tambahDokter = useTambahDokter(
    () => { 
      setIsTambahOpen(false); // Setelah berhasil mendaftar, tutup meja formulirnya
      fetchDokter(); // Minta asisten menyegarkan buku daftar
    },
    showToast
  );

  // 3. MEMANGGIL JURU TULIS KOREKSI DOKTER LAMA (useEditDokter)
  const editDokter = useEditDokter(
    selectedDokter,
    () => { 
      setIsEditOpen(false); // Setelah berhasil dikoreksi, tutup meja koreksinya
      fetchDokter(); // Minta asisten menyegarkan buku daftar
    },
    showToast
  );

  // 4. MEMANGGIL PETUGAS PENCABUT IZIN & PENGATUR STATUS (useHapusDokter)
  const { confirmDelete, updateStatusDokter } = useHapusDokter(
    selectedDokter,
    () => { 
      fetchDokter(); // Minta asisten menyegarkan buku daftar
    },
    showToast
  );

  // Fungsi saat tombol pensil (edit) ditekan di atas etalase
  const handleEdit = (dokter) => {
    setSelectedDokter(dokter); // Tunjuk dokternya
    setIsEditOpen(true); // Buka meja formulir koreksi
  };

  // Fungsi saat tombol tong sampah (hapus) ditekan
  const handleDelete = (dokter) => {
    setSelectedDokter(dokter); // Tunjuk dokternya
    setIsHapusOpen(true); // Buka plang peringatan hapus
  };

  // Fungsi saat admin memutar pilihan status (Tersedia / Tidak Tersedia)
  const handleStatusChange = (id, newStatus) => {
    updateStatusDokter(id, newStatus);
  };

  // 5. SISTEM PEMBAGIAN HALAMAN BUKU (PAGINATION)
  // Menentukan bahwa satu halaman buku maksimal memuat 6 nama dokter
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(dataDokter.length / ITEMS_PER_PAGE);

  // Jika admin mulai mengetik di loket pencarian, otomatis buka kembali buku dari halaman 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Menggunting daftar dokter sesuai nomor halaman yang sedang dibuka
  const paginatedDokter = dataDokter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Mandor membagikan seluruh alat, saklar, dan catatan ini ke halaman utama
  return {
    selectedDokter,
    setSelectedDokter,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    showToast,
    dataDokter,
    searchQuery,
    setSearchQuery,
    isLoading,
    tambahDokter,
    editDokter,
    confirmDelete,
    updateStatusDokter,
    handleEdit,
    handleDelete,
    handleStatusChange,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedDokter
  };
};
