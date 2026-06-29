import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * MANDOR KEPALA PENCATAT TRANSAKSI PENJUALAN (useKelolaPenjualan)
 * =========================================================================
 * Ibarat manajer pembukuan senior yang duduk di meja kendali keuangan klinik:
 * 1. Menugaskan kurir khusus (useFetchWithCache) untuk mengambil salinan buku besar penjualan dari brankas server.
 * 2. Menyediakan kalkulator dan kaca pembesar (searchQuery & filterProduk) agar admin bisa meneliti pesanan tertentu.
 * 3. Mengatur jadwal buka-tutup kotak rincian pesanan, formulir nomor resi kurir, dan permintaan cetak laporan Excel.
 * 4. Berjaga-jaga memberikan pengumuman lewat TOA (toast) jika ada perubahan status pembayaran atau pengiriman.
 */
export const useKelolaPenjualan = () => {
  // =========================================================================
  // 1. MENGAMBIL BUKU BESAR PENJUALAN DARI SERVER
  // =========================================================================
  // Memerintahkan kurir cepat mengambil data penjualan dari brankas server pusat (menggunakan sistem penyimpanan cepat / cache)
  const { data, isLoading: isCacheLoading, error: cacheError, mutate } = useFetchWithCache(endpoints.admin.penjualan);

  // --- KOTAK ISIAN KACA PEMBESAR (PENCARIAN & FILTER) ---
  // Laci untuk menyimpan tulisan yang diketik di kotak pencarian
  const [searchQuery, setSearchQuery] = useState('');
  // Laci untuk menyimpan nama produk yang dipilih sebagai penyaring
  const [filterProduk, setFilterProduk] = useState('Semua Produk');
  
  // --- KOTAK CATATAN BUKU BESAR ---
  // Tempat menyimpan daftar transaksi penjualan yang sudah bersih dan siap tampil
  const [penjualan, setPenjualan] = useState([]);
  // Tempat mencatat jika terjadi masalah atau gagal memuat data
  const [error, setError] = useState(null);
  // Penanda rambu sibuk saat kurir sedang mengambil data
  const isLoading = isCacheLoading;

  /*
    MEMERIKSA SURAT KELUHAN (useEffect):
    Jika kurir gagal mengambil data (cacheError), catat alasannya di laci 'error'
  */
  useEffect(() => {
    if (cacheError) {
      setError(cacheError.response?.data?.message || cacheError.message || 'Terjadi kesalahan saat memuat penjualan');
    }
  }, [cacheError]);

  /*
    MENYUSUN RAPI BUKU BESAR (useEffect):
    Begitu kurir pulang membawa salinan data penjualan, pastikan isinya berbentuk daftar (array) dan simpan di laci 'penjualan'
  */
  useEffect(() => {
    if (data) {
      const penjualanData = data.data || data;
      setPenjualan(Array.isArray(penjualanData) ? penjualanData : []);
    }
  }, [data]);

  /*
    TOMBOL REFRESH BUKU BESAR (fetchPenjualan):
    Fungsi untuk menyuruh kurir mengambil salinan terbaru dari server (mutate)
  */
  const fetchPenjualan = useCallback(async () => {
    mutate();
  }, [mutate]);

  // =========================================================================
  // 2. TIM KURIR PENGUBAH DATA (STATUS, RESI, HAPUS, CETAK EXCEL)
  // =========================================================================
  
  /*
    KURIR PENGUBAH STATUS PESANAN (updateStatus):
    Bertugas membawa laporan perubahan status pesanan (misal: dari 'pending' menjadi 'dikirim') ke server pusat.
  */
  const updateStatus = async (idPenjualan, newStatus) => {
    try {
      const payload = { orderStatus: newStatus };
      // Mengirimkan perubahan status (PATCH) ke komputer server
      const response = await axiosClient.patch(`${endpoints.admin.penjualan}/${idPenjualan}`, payload);
      if (response.data.success) {
        fetchPenjualan(); // Segarkan buku besar agar status terbaru muncul di tabel
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal memperbarui status' };
    }
  };

  /*
    KURIR PENCATAT NOMOR RESI PENGIRIMAN (inputResi):
    Bertugas membawa nomor resi pengiriman kurir yang baru diketik admin untuk ditempelkan pada pesanan di server.
  */
  const inputResi = async (idPenjualan, nomorResi) => {
    try {
      // Mengirimkan nomor resi (PATCH) ke alamat resi di server
      const response = await axiosClient.patch(`${endpoints.admin.penjualan}/${idPenjualan}/resi`, { nomorResi });
      if (response.data.success) {
        fetchPenjualan(); // Segarkan buku besar agar resi baru bisa dilihat
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menyimpan resi' };
    }
  };

  /*
    KURIR PENGHAPUS CATATAN PESANAN (hapusPenjualan):
    Bertugas membawa surat perintah pencoretan transaksi (DELETE) ke brankas server.
  */
  const hapusPenjualan = async (idPenjualan) => {
    try {
      const response = await axiosClient.delete(`${endpoints.admin.penjualan}/${idPenjualan}`);
      if (response.data.success) {
        fetchPenjualan(); // Segarkan buku besar agar transaksi yang dihapus lenyap dari meja
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menghapus penjualan' };
    }
  };

  /*
    MESIN PENCETAK DOKUMEN EXCEL (exportExcelPenjualan):
    Ibarat mesin fotokopi canggih yang meminta berkas jadi berformat Excel (blob) dari server, 
    lalu merakitnya menjadi file siap unduh di komputer admin.
  */
  const exportExcelPenjualan = async (filters) => {
    try {
      // Mengirimkan surat permintaan cetak beserta filter ke server pusat
      const response = await axiosClient.get(endpoints.admin.report.penjualan, {
        params: filters,
        responseType: 'blob' // Meminta berkas mentah berupa file biner (blob)
      });
      // Membuat jembatan unduh sementara di memori peramban (browser)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Membaca label nama file dari balasan server (content-disposition)
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'Laporan_Penjualan.xlsx';
      if (contentDisposition) {
         const match = contentDisposition.match(/filename="?([^"]+)"?/);
         if (match && match[1]) filename = match[1];
      }
      
      // Menempelkan jembatan unduh, menekan klik secara otomatis, lalu membuang jembatannya
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Gagal mengunduh laporan excel' };
    }
  };

  // =========================================================================
  // 3. PENGATUR KELOMPOK MAP BERKAS (TABS & FILTERING)
  // =========================================================================
  // Catatan tab kelompok mana yang sedang dibuka (misal: 'Semua', 'Sudah Bayar', 'Belum Bayar', atau status lain)
  const [activeTab, setActiveTab] = useState('Semua');

  /*
    MESIN PENYARING PESANAN (filteredPenjualan):
    Setiap kali admin mengetik nama pembeli/nomor invoice ATAU memencet tab kelompok lain, 
    mesin ini memilah pesanan yang cocok dan mengurutkannya dari yang paling baru (sort tanggal).
  */
  const filteredPenjualan = penjualan.filter(item => {
    // Memeriksa kesesuaian ketikan di kotak pencarian dengan nama pembeli atau nomor nota (invoiceNumber)
    const searchMatch = (item.user?.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                        (item.invoiceNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    let tabMatch = true;
    // JIKA tab yang dipilih adalah 'Sudah Bayar', cari yang berstatus bayar 'paid', 'settlement', atau 'capture'
    if (activeTab === 'Sudah Bayar') {
      const ps = (item.paymentStatus || item.status_pembayaran || '').toLowerCase();
      tabMatch = ps === 'paid' || ps === 'settlement' || ps === 'capture';
    } 
    // JIKA tab yang dipilih adalah 'Belum Bayar', cari yang TIDAK berstatus lunas
    else if (activeTab === 'Belum Bayar') {
      const ps = (item.paymentStatus || item.status_pembayaran || '').toLowerCase();
      tabMatch = !(ps === 'paid' || ps === 'settlement' || ps === 'capture');
    } 
    // JIKA tab lain (misal: status pesanan 'pending', 'dikirim', 'selesai')
    else if (activeTab !== 'Semua') {
      tabMatch = (item.orderStatus || 'pending') === activeTab;
    }
    return searchMatch && tabMatch;
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Mengurutkan dari tanggal terbaru ke terlama

  // =========================================================================
  // 4. PENANDA BUKA/TUTUP PINTU POP-UP (MODALS STATE)
  // =========================================================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Pop-up konfirmasi hapus
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // Pop-up cetak Excel
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Pop-up rincian nota pesanan
  const [isResiModalOpen, setIsResiModalOpen] = useState(false);     // Pop-up pengisian nomor resi
  
  // --- LACI MENYIMPAN TRANSAKSI YANG DIPILIH ---
  const [itemToDelete, setItemToDelete] = useState(null); // Menyimpan ID yang ingin dihapus
  const [itemToDetail, setItemToDetail] = useState(null); // Menyimpan data rincian pesanan
  const [itemToResi, setItemToResi] = useState(null);     // Menyimpan data pesanan untuk diisi resi
  
  // --- PENGATUR TOA PENGUMUMAN (TOAST ALERT) ---
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  // =========================================================================
  // 5. PENGATUR HALAMAN LEMBAR CATATAN (PAGINATION)
  // =========================================================================
  const [currentPage, setCurrentPage] = useState(1); // Nomor halaman yang sedang aktif
  const ITEMS_PER_PAGE = 6;                          // Batas maksimal 6 pesanan per halaman
  // Menghitung total lembar halaman
  const totalPages = Math.ceil(filteredPenjualan.length / ITEMS_PER_PAGE);

  /*
    JIKA KOTAK PENCARIAN ATAU FILTER DIOTAK-ATIK (useEffect):
    Otomatis kembalikan buka halaman ke lembar pertama (angka 1).
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProduk]);

  // Memotong daftar pesanan yang sudah tersaring menjadi 6 item per halaman
  const paginatedPenjualan = filteredPenjualan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /*
    FUNGSI MENGUMUMKAN LEWAT TOA (displayToast):
    Membunyikan pesan berhasil ('success') atau gagal ('error') di sudut layar.
  */
  const displayToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // --- FUNGSI SAAT TOMBOL PADA TABEL DITEKAN ---
  
  // Tombol Hapus ditekan: Simpan ID pesanan dan buka pop-up konfirmasi hapus
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Tombol Detail ditekan: Simpan data pesanan dan buka pop-up rincian nota
  const handleDetailClick = (item) => {
    setItemToDetail(item);
    setIsDetailModalOpen(true);
  };

  // Tombol Resi ditekan: Simpan data pesanan dan buka pop-up input resi
  const handleResiClick = (item) => {
    setItemToResi(item);
    setIsResiModalOpen(true);
  };

  // Tombol Export Excel ditekan: Buka pop-up isian filter unduh laporan
  const handleExportClick = () => setIsExportModalOpen(true);

  /*
    PROSES EKSEKUSI PENGHAPUSAN (handleConfirmDelete):
    Dijalankan begitu admin menekan tombol "Ya, Hapus" di pop-up konfirmasi.
  */
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const res = await hapusPenjualan(itemToDelete);
      if (res.success) {
        displayToast(res.message, "success"); // Bunyikan TOA berhasil
      } else {
        displayToast(res.message, "error");   // Bunyikan TOA gagal
      }
    }
    setIsDeleteModalOpen(false); // Tutup pop-up
    setItemToDelete(null);       // Bersihkan laci
  };

  /*
    PROSES EKSEKUSI UNDUH LAPORAN (handleConfirmExport):
    Dijalankan begitu admin menyetujui filter dan menekan tombol unduh Excel.
  */
  const handleConfirmExport = async (filters) => {
    const res = await exportExcelPenjualan(filters);
    if (res.success) {
      displayToast('Laporan berhasil diunduh', "success");
      setIsExportModalOpen(false); // Tutup pop-up Excel
    } else {
      displayToast(res.message || 'Gagal mengunduh laporan', "error");
    }
  };

  /*
    PROSES PERUBAHAN STATUS TRANSAKSI (handleStatusChange):
    Dijalankan begitu admin mengganti pilihan status pada menu turun (dropdown).
  */
  const handleStatusChange = async (idPenjualan, newStatus) => {
    const res = await updateStatus(idPenjualan, newStatus);
    if (res.success) {
      displayToast(res.message, "success");
    } else {
      displayToast(res.message, "error");
    }
  };

  /*
    PROSES PENYIMPANAN NOMOR RESI (handleConfirmResi):
    Dijalankan begitu admin menekan tombol "Simpan Resi" di pop-up resi.
  */
  const handleConfirmResi = async (idPenjualan, nomorResi) => {
    const res = await inputResi(idPenjualan, nomorResi);
    if (res.success) {
      displayToast(res.message, "success");
      setIsResiModalOpen(false); // Tutup pop-up resi
      setItemToResi(null);       // Bersihkan laci
    } else {
      displayToast(res.message, "error");
    }
  };

  // =========================================================================
  // MEMBERIKAN SELURUH DATA DAN FUNGSI KE HALAMAN MEJA KASIR (Index.jsx)
  // =========================================================================
  return {
    searchQuery, setSearchQuery,
    filterProduk, setFilterProduk,
    activeTab, setActiveTab,
    filteredPenjualan,
    penjualan,
    isLoading,
    error,
    fetchPenjualan,
    updateStatus,
    inputResi,
    hapusPenjualan,
    exportExcelPenjualan,
    isDeleteModalOpen, setIsDeleteModalOpen,
    isExportModalOpen, setIsExportModalOpen,
    isDetailModalOpen, setIsDetailModalOpen,
    isResiModalOpen, setIsResiModalOpen,
    itemToDelete, setItemToDelete,
    itemToDetail, setItemToDetail,
    itemToResi, setItemToResi,
    toastMessage, setToastMessage,
    toastType, setToastType,
    showToast, setShowToast,
    currentPage, setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedPenjualan,
    displayToast,
    handleDeleteClick,
    handleDetailClick,
    handleResiClick,
    handleExportClick,
    handleConfirmDelete,
    handleConfirmExport,
    handleStatusChange,
    handleConfirmResi
  };
};
