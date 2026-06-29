import { useState } from "react";
// Mengimpor pengatur ambil daftar jadwal
import { useFetchJadwal } from "./useFetchJadwal";
// Mengimpor pengatur pendaftaran jadwal baru
import { useTambahJadwal } from "./useTambahJadwal";
// Mengimpor pengatur ubah jadwal lama
import { useEditJadwal } from "./useEditJadwal";
// Mengimpor pengatur hapus jadwal
import { useHapusJadwal } from "./useHapusJadwal";

/**
 * =========================================================================
 * PENGATUR UTAMA HALAMAN JADWAL (Ibarat Pengatur Utama di Toko)
 * =========================================================================
 * File ini ibarat "Pengatur Utama" di halaman kelola jadwal klinik Mische.
 * Dia yang bertugas mengoordinasikan 4 pengatur khusus di bawahnya (Ambil, Tambah, Ubah, Hapus).
 * Dia juga mengatur jadwal mana yang sedang dipilih, mengelola buka/tutup ketiga 
 * kotak pop-up, serta memotong daftar jadwal menjadi beberapa halaman (pagination).
 */
export const useKelolaJadwal = () => {
  // =========================================================================
  // 1. KOTAK PENYIMPANAN DATA & STATUS KOTAK POP-UP
  // =========================================================================
  // Kotak untuk menampung data jadwal yang sedang dipilih admin (untuk diedit atau dihapus)
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  
  // Penanda buka/tutup kotak pop-up Tambah Jadwal Baru
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  // Penanda buka/tutup kotak pop-up Ubah/Edit Jadwal
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Penanda buka/tutup kotak pop-up Konfirmasi Hapus
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  
  // Pengatur pesan notifikasi di pojok layar (Toast Alert)
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  // =========================================================================
  // 2. FUNGSI PEMUNCUL NOTIFIKASI (showToast)
  // =========================================================================
  /**
   * Fungsi ini bertugas memunculkan pesan singkat di pojok layar.
   * Jika berhasil, tampilkan warna hijau ('success'). Jika gagal, tampilkan warna merah ('error').
   */
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // =========================================================================
  // 3. MENGHUBUNGKAN KE 4 PENGATUR KHUSUS
  // =========================================================================
  
  // PENGATUR 1: AMBIL DAFTAR JADWAL
  // Memantau data jadwal dari server pusat dan menyerahkan daftar 'dataJadwal'
  const { dataJadwal, isLoading, fetchSchedules } = useFetchJadwal();

  // PENGATUR 2: TAMBAH JADWAL BARU
  // Mengirimkan daftar jadwal saat ini dan memberi instruksi: jika berhasil simpan, tutup pop-up, segarkan tabel, dan munculkan notifikasi sukses
  const tambahJadwal = useTambahJadwal(
    dataJadwal,
    () => {
      setIsTambahOpen(false); // Tutup pop-up tambah
      fetchSchedules(); // Segarkan tabel jadwal
      showToast("Jadwal berhasil ditambahkan!"); // Tampilkan notifikasi sukses
    },
    isTambahOpen
  );

  // PENGATUR 3: UBAH/EDIT JADWAL LAMA
  // Mengirimkan data jadwal yang dipilih (selectedJadwal) dan instruksi: jika berhasil diubah, tutup pop-up, segarkan tabel, dan munculkan notifikasi sukses
  const editJadwal = useEditJadwal(
    selectedJadwal,
    dataJadwal,
    () => {
      setIsEditOpen(false); // Tutup pop-up edit
      fetchSchedules(); // Segarkan tabel jadwal
      showToast("Jadwal berhasil diperbarui!"); // Tampilkan notifikasi sukses
    },
    isEditOpen
  );

  // PENGATUR 4: HAPUS JADWAL
  // Mengirimkan data jadwal yang dipilih (selectedJadwal) dan instruksi: jika berhasil dihapus, tutup pop-up, segarkan tabel, dan munculkan notifikasi sukses
  const hapusJadwal = useHapusJadwal(
    selectedJadwal,
    () => {
      setIsHapusOpen(false); // Tutup pop-up hapus
      fetchSchedules(); // Segarkan tabel jadwal
      showToast("Jadwal berhasil dihapus!"); // Tampilkan notifikasi sukses
    },
    showToast // Dilengkapi fungsi notifikasi jika gagal menghapus
  );

  // =========================================================================
  // 4. FUNGSI SAAT TOMBOL DI TABEL DITEKAN (HANDLE ACTIONS)
  // =========================================================================
  /**
   * Begitu admin menekan tombol Edit di tabel, fungsi ini menyimpan data jadwalnya 
   * di laci `selectedJadwal` dan membuka kotak pop-up Edit (isEditOpen = true).
   */
  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  /**
   * Begitu admin menekan tombol Hapus di tabel, fungsi ini menyimpan data jadwalnya 
   * di laci `selectedJadwal` dan membuka kotak pop-up Konfirmasi Hapus (isHapusOpen = true).
   */
  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  // =========================================================================
  // 5. PENGATUR PEMBAGIAN HALAMAN TABEL (PAGINATION)
  // =========================================================================
  /*
    Fungsi ini membatasi jumlah jadwal yang tampil di layar agar tetap rapi.
    Tabel dibatasi hanya menampilkan maksimal 6 jadwal per halaman (ITEMS_PER_PAGE = 6).
  */
  const [currentPage, setCurrentPage] = useState(1); // Catatan halaman aktif saat ini
  const ITEMS_PER_PAGE = 6; // Batas maksimal 6 jadwal per halaman
  // Menghitung total seluruh halaman (jumlah total jadwal dibagi 6, lalu dibulatkan ke atas)
  const totalPages = Math.ceil(dataJadwal.length / ITEMS_PER_PAGE);

  // Memotong (slice) daftar jadwal sesuai porsi halaman yang sedang dibuka admin
  const paginatedJadwal = dataJadwal.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // =========================================================================
  // MEMBERIKAN SEMUA DATA DAN FUNGSI KE HALAMAN UTAMA
  // =========================================================================
  return {
    isLoading,
    paginatedJadwal,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    tambahJadwal,
    editJadwal,
    hapusJadwal,
    handleEdit,
    handleDelete
  };
};
