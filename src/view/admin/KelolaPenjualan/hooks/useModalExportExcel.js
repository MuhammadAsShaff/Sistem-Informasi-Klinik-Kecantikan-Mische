import { useState } from 'react';
// Meminta fungsi pengambil daftar produk yang ada di toko
import { useFetchProduk } from '../../KelolaProduk/hooks/useFetchProduk';

/**
 * =========================================================================
 * PENGATUR KOTAK FILTER DOWNLOAD EXCEL (Ibarat Formulir Permintaan Laporan)
 * =========================================================================
 * File ini ibarat "Asisten Penyiap Formulir" di meja kasir.
 * Tugasnya adalah mengambil daftar barang yang ada di toko, lalu menyediakan
 * kotak isian untuk memilih rentang tanggal (Tanggal Mulai & Tanggal Selesai).
 * Setelah admin selesai memilih, asisten ini meneruskannya ke sistem pencetak Excel.
 */
export const useModalExportExcel = (onExport) => {
  // 1. Mengambil daftar produk dari server toko
  const { products } = useFetchProduk();
  
  // 2. Tempat menyimpan isian filter (Pilihan produk, tanggal awal, dan tanggal akhir)
  const [filters, setFilters] = useState({
    idProduk: 'semua',   // Default: Pilih semua produk
    tanggalMulai: '',    // Tanggal awal pencarian
    tanggalSelesai: ''   // Tanggal akhir pencarian
  });

  // --- FUNGSI MENCATAT PERUBAHAN ISIAN ---
  // Setiap kali admin mengganti tanggal atau memilih produk lain, langsung dicatat di sini
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNGSI MEMULAI PROSES EXPORT ---
  // Meneruskan isian filter tadi ke fungsi utama untuk dibuatkan file Excel
  const handleExport = () => {
    onExport(filters);
  };

  // Mengirimkan daftar produk dan fungsi-fungsi ini ke kotak pop-up Export Excel
  return {
    products,
    filters,
    handleChange,
    handleExport
  };
};
