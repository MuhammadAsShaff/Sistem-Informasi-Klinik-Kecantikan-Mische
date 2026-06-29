import { useState, useEffect, useRef } from "react";

/**
 * =========================================================================
 * ASISTEN PENGATUR PAPAN HALAMAN TABEL (useKelolaPromoTabel)
 * =========================================================================
 * Ibarat asisten pengatur etalase yang memastikan meja pameran tidak berantakan.
 * Asisten ini membatasi hanya 6 lembar promo yang boleh dipajang di atas meja sekaligus.
 * Sisanya disimpan rapi di halaman berikutnya.
 */
export const useKelolaPromoTabel = (data) => {
  // Catatan nomor halaman yang sedang dibuka admin saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // Batas maksimal lembar promo per halaman (6 buah)
  const itemsPerPage = 6;
  // Menghitung total lembar halaman yang diperlukan untuk menampung seluruh promo
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Asisten menggunting daftar promo hanya untuk halaman yang sedang aktif
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedData
  };
};

/**
 * =========================================================================
 * ASISTEN TOMBOL LIPAT STATUS PROMO (useStatusDropdown)
 * =========================================================================
 * Ibarat asisten penjaga tombol lipat (dropdown) status Aktif/Tidak Aktif.
 * Asisten ini punya reflek cepat: jika admin mengeklik area luar di luar tombol, 
 * asisten langsung melipat dan menutup daftar pilihannya agar layar tetap rapi.
 */
export const useStatusDropdown = () => {
  // Saklar penanda apakah daftar pilihan status sedang mekar (terbuka) atau kuncup
  const [isOpen, setIsOpen] = useState(false);
  // Tongkat penunjuk letak persis tombol lipat di layar
  const dropdownRef = useRef(null);

  /**
   * EFEK SAMPING: PEMANTAU KETUKAN DI LUAR AREA
   * Asisten memasang radar di seluruh layar. Jika ada ketukan yang jatuh di luar area 
   * tombol lipat, asisten langsung menutup saklar isOpen.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Lipat kembali daftar pilihan
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    isOpen,
    setIsOpen,
    dropdownRef
  };
};
