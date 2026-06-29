import { useState } from "react";
import { useFetchPromo } from "./useFetchPromo";
import { useTambahPromo } from "./useTambahPromo";
import { useEditPromo } from "./useEditPromo";
import { useHapusPromo } from "./useHapusPromo";

/**
 * =========================================================================
 * MANDOR PENGATUR UTAMA RUANGAN PROMO (useKelolaPromoHook)
 * =========================================================================
 * Ibarat mandor besar yang berdiri di tengah ruangan manajemen promo. Mandor ini mengoordinasikan 
 * empat asisten utamanya:
 * 1. Asisten Pengamat Etalase (useFetchPromo): Mengambil dan menyaring daftar promo.
 * 2. Asisten Pendaftaran (useTambahPromo): Mengurus perumusan promo baru.
 * 3. Asisten Koreksi (useEditPromo): Membetulkan rincian promo lama.
 * 4. Petugas Pembersih (useHapusPromo): Mencabut berkas dan mengatur saklar aktif.
 * 
 * Mandor juga memegang 5 kunci gembok untuk membuka/menutup bilik-bilik pop-up (Modal) 
 * serta menguasai mikrofon TOA pengumuman (Toast).
 */
export const useKelolaPromoHook = () => {
  // Gembok 1: Kunci bilik pendaftaran promo baru
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  // Gembok 2: Kunci bilik meja koreksi promo lama
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Gembok 3: Kunci plang peringatan pemusnahan promo
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  // Gembok 4: Kunci bilik pameran detail rincian promo
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // Gembok 5: Kunci meja kerja distribusi kurir selebaran
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  // Papan petunjuk promo mana yang sedang disorot atau ingin dibongkar
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Pengendali mikrofon TOA pengumuman di atap balai
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Mempekerjakan Asisten Pengamat Etalase Promo
  const { dataPromo, searchQuery, setSearchQuery, fetchPromo, isLoading } = useFetchPromo();

  // Mempekerjakan Asisten Pendaftaran Promo Baru
  const {
    formData: formTambah,
    handleInputChange: handleInputTambah,
    submitTambahPromo,
    isSubmitting: isSubmittingTambah,
    error: errorTambah,
    resetForm: resetFormTambah,
  } = useTambahPromo(() => {
    setIsTambahOpen(false); // Setelah berhasil mendaftar, mandor menutup bilik pendaftaran
    fetchPromo(); // Meminta asisten pengamat menyegarkan tabel
  }, showToast);

  // Mempekerjakan Asisten Koreksi Promo Lama
  const {
    formData: formEdit,
    handleInputChange: handleInputEdit,
    submitEditPromo,
    isSubmitting: isSubmittingEdit,
    error: errorEdit,
  } = useEditPromo(selectedPromo, () => {
    setIsEditOpen(false); // Setelah berhasil mengoreksi, mandor menutup bilik koreksi
    fetchPromo(); // Meminta asisten pengamat menyegarkan tabel
  }, showToast);

  // Mempekerjakan Petugas Pembersih & Saklar Aktif
  const { confirmDelete, updateStatusPromo } = useHapusPromo(
    selectedPromo,
    () => fetchPromo(),
    showToast
  );

  /**
   * TOMBOL PINTAS PEMBUKA BILIK MEJA KOREKSI
   * Saat admin menekan ikon pensil, mandor mencatat nama promo tersebut lalu membuka gembok bilik koreksi.
   */
  const handleOpenEdit = (promo) => {
    setSelectedPromo(promo);
    setIsEditOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA BILIK PAMERAN DETAIL
   * Saat admin menekan ikon mata, mandor mencatat nama promo lalu membuka gembok bilik detail.
   */
  const handleOpenDetail = (promo) => {
    setSelectedPromo(promo);
    setIsDetailOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA PLANG PERINGATAN HAPUS
   * Saat admin menekan ikon tong sampah, mandor mencatat nama promo lalu membuka plang peringatan.
   */
  const handleOpenDelete = (promo) => {
    setSelectedPromo(promo);
    setIsHapusOpen(true);
  };

  /**
   * TOMBOL PINTAS PEMBUKA MEJA KERJA DISTRIBUSI KURIR
   * Saat admin menekan ikon pesawat kertas (Send), mandor mencatat nama promo lalu membuka meja distribusi.
   */
  const handleSendPromo = (promo) => {
    setSelectedPromo(promo);
    setIsDistribusiOpen(true);
  };

  // Mandor menyerahkan seluruh kunci, saklar, dan asisten kepada ruangan utama (view)
  return {
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    isDetailOpen, setIsDetailOpen,
    isDistribusiOpen, setIsDistribusiOpen,
    selectedPromo, setSelectedPromo,
    toast, setToast, showToast,
    dataPromo, searchQuery, setSearchQuery, isLoading,
    formTambah, handleInputTambah, submitTambahPromo, isSubmittingTambah, errorTambah, resetFormTambah,
    formEdit, handleInputEdit, submitEditPromo, isSubmittingEdit, errorEdit,
    confirmDelete, updateStatusPromo,
    handleOpenEdit, handleOpenDetail, handleOpenDelete, handleSendPromo
  };
};
