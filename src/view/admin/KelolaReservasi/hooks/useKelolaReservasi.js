import { useState } from "react";
import { useFetchReservasi } from "./useFetchReservasi";
import { useUbahStatusReservasi } from "./useUbahStatusReservasi";
import { useHapusReservasi } from "./useHapusReservasi";
import { useTambahReservasi } from "./useTambahReservasi";

/**
 * =========================================================================
 * MANDOR PENGATUR BALAI RESERVASI TAMU (useKelolaReservasi)
 * =========================================================================
 * Ibarat mandor besar yang memimpin lobi antrean perawatan klinik. Mandor ini dibantu oleh 4 asisten handal:
 * 1. Asisten Penjaga Antrean (useFetchReservasi): Mengambil dan menggelar daftar tamu.
 * 2. Petugas Penanda Status (useUbahStatusReservasi): Mengganti pita kehadiran tamu (Menunggu/Selesai/Batal).
 * 3. Petugas Pembersih (useHapusReservasi): Mencoret tamu dari buku antrean.
 * 4. Asisten Kurir Pendaftaran (useTambahReservasi): Mendaftarkan tamu baru.
 * 
 * Mandor juga memegang 5 kunci gembok untuk membuka/menutup meja kerja lipat (Modal) 
 * serta menguasai TOA pengumuman di atap balai.
 */
export const useKelolaReservasi = () => {
  // Papan penunjuk tamu mana yang sedang disorot untuk diubah statusnya atau dicoret
  const [selectedReservasi, setSelectedReservasi] = useState(null);

  // Gembok 1: Kunci meja kerja pengecapan status kehadiran
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  // Gembok 2: Kunci bilik pameran rincian lengkap tamu
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // Gembok 3: Kunci plang peringatan pencoretan tamu
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  // Gembok 4: Kunci bilik meja pendaftaran tamu baru
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  // Gembok 5: Kunci meja pencetakan buku besar Excel
  const [isExcelOpen, setIsExcelOpen] = useState(false);

  // Pengendali mikrofon TOA pengumuman
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Catatan nomor halaman yang sedang dibuka
  const [page, setPage] = useState(1);
  // Kotak ketikan tempat pimpinan mencari nama, jenis perawatan, atau nama dokter
  const [searchTerm, setSearchTerm] = useState("");

  // Mempekerjakan Asisten Penjaga Antrean Tamu
  const { dataReservasi, meta, isLoading, fetchReservasi } = useFetchReservasi(page);

  // Mandor menyaring daftar tamu secara mandiri berdasarkan ketikan di kotak pencarian
  const filteredReservasi = dataReservasi.filter(item => 
    (item.namaCustomer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.jenisTreatment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.dokter?.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.nomorWa?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Mempekerjakan Petugas Penanda Status Kehadiran Tamu
  const ubahStatusHook = useUbahStatusReservasi(
    selectedReservasi,
    () => {
      setIsStatusOpen(false); // Setelah cap status diganti, tutup meja pengecapan
      fetchReservasi(); // Minta asisten penjaga menyegarkan antrean
      showToast("Berhasil memperbarui reservasi");
    },
    isStatusOpen
  );

  // Mempekerjakan Petugas Pembersih & Pencoret Tamu
  const hapusHook = useHapusReservasi(
    selectedReservasi,
    () => {
      setIsHapusOpen(false); // Setelah tamu dicoret, tutup plang peringatan
      fetchReservasi(); // Minta asisten penjaga menyegarkan antrean
      showToast("Berhasil menghapus reservasi");
    },
    showToast
  );

  // Mempekerjakan Asisten Kurir Pendaftaran Tamu Baru
  const { tambahReservasi, isSubmitting: isTambahSubmitting } = useTambahReservasi(
    (msg) => {
      setIsTambahOpen(false); // Setelah pendaftaran sukses, tutup meja pendaftaran
      fetchReservasi(); // Minta asisten penjaga menyegarkan antrean
      showToast("Berhasil menambahkan reservasi");
    },
    (errMsg) => {
      showToast(errMsg, "error"); // Umumkan jika pendaftaran kandas
    }
  );

  /**
   * TOMBOL PINTAS PEMBUKA MEJA PENGECAPAN STATUS
   * Ketika tombol status tamu ditekan, mandor mencatat nama tamu lalu membuka gembok meja pengecapan.
   */
  const handleEditStatus = (item) => {
    setSelectedReservasi(item);
    setIsStatusOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA BILIK PAMERAN DETAIL
   * Ketika pimpinan ingin melihat biodata lengkap, mandor mencatat nama tamu lalu membuka bilik detail.
   */
  const handleDetail = (item) => {
    setSelectedReservasi(item);
    setIsDetailOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA PLANG PERINGATAN HAPUS
   * Ketika ikon tong sampah ditekan, mandor mencatat nama tamu lalu membuka plang peringatan.
   */
  const handleDelete = (item) => {
    setSelectedReservasi(item);
    setIsHapusOpen(true);
  };

  /**
   * TUGAS PENGUTUSAN KURIR PENDAFTARAN
   * Begitu formulir selesai ditulis, mandor menyerahkan berkasnya kepada kurir pendaftaran.
   */
  const handleTambahSubmit = (payload) => {
    tambahReservasi(payload);
  };

  // Mandor menyerahkan seluruh gembok, asisten, dan laci data kepada ruangan utama (view)
  return {
    selectedReservasi,
    isStatusOpen, setIsStatusOpen,
    isDetailOpen, setIsDetailOpen,
    isHapusOpen, setIsHapusOpen,
    isTambahOpen, setIsTambahOpen,
    isExcelOpen, setIsExcelOpen,
    toast, setToast, showToast,
    page, setPage,
    searchTerm, setSearchTerm,
    filteredReservasi,
    meta,
    isLoading,
    ubahStatusHook,
    hapusHook,
    isTambahSubmitting,
    handleEditStatus,
    handleDetail,
    handleDelete,
    handleTambahSubmit
  };
};
