import { useState, useRef, useEffect } from 'react';

/**
 * =========================================================================
 * PETUGAS PEMILAH KERTAS PROMO (useFilterPromo)
 * =========================================================================
 * Ibarat petugas di pos informasi yang memegang laci arsip pemisah kupon:
 * 1. Menjaga tuas laci pemisah (isOpen).
 * 2. Jika tamu menekan tombol filter, petugas membuka laci untuk menampilkan jenis kupon (Diskon, Gratis, Potongan) dan status keberlakuannya.
 * 3. Jika tamu melengos atau mengklik tempat lain, petugas dengan sigap menutup lacinya kembali.
 */
export const useFilterPromo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const jenisOptions = [
    { label: 'Semua Jenis', value: 'Semua' },
    { label: 'Gratis Produk', value: 'gratis produk' },
    { label: 'Diskon Persen', value: 'diskon persen' },
    { label: 'Potongan Harga', value: 'potongan harga' }
  ];

  const statusOptions = [
    { label: 'Semua Status', value: 'Semua' },
    { label: 'Masih Berlaku', value: 'Aktif' },
    { label: 'Tidak Berlaku', value: 'Tidak Aktif' }
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  return {
    isOpen,
    dropdownRef,
    toggleDropdown,
    jenisOptions,
    statusOptions
  };
};
