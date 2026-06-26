import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const useKelolaPenjualan = () => {
  const { data, isLoading: isCacheLoading, error: cacheError, mutate } = useFetchWithCache(endpoints.admin.penjualan);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduk, setFilterProduk] = useState('Semua Produk');
  
  const [penjualan, setPenjualan] = useState([]);
  const [error, setError] = useState(null);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (cacheError) {
      setError(cacheError.response?.data?.message || cacheError.message || 'Terjadi kesalahan saat memuat penjualan');
    }
  }, [cacheError]);

  useEffect(() => {
    if (data) {
      const penjualanData = data.data || data;
      setPenjualan(Array.isArray(penjualanData) ? penjualanData : []);
    }
  }, [data]);

  const fetchPenjualan = useCallback(async () => {
    mutate();
  }, [mutate]);

  const updateStatus = async (idPenjualan, newStatus) => {
    try {
      const payload = { orderStatus: newStatus };
      
      const response = await axiosClient.patch(`${endpoints.admin.penjualan}/${idPenjualan}`, payload);
      if (response.data.success) {
        fetchPenjualan(); // Refresh data
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal memperbarui status' };
    }
  };

  const inputResi = async (idPenjualan, nomorResi) => {
    try {
      const response = await axiosClient.patch(`${endpoints.admin.penjualan}/${idPenjualan}/resi`, { nomorResi });
      if (response.data.success) {
        fetchPenjualan(); // Refresh data
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menyimpan resi' };
    }
  };

  const hapusPenjualan = async (idPenjualan) => {
    try {
      const response = await axiosClient.delete(`${endpoints.admin.penjualan}/${idPenjualan}`);
      if (response.data.success) {
        fetchPenjualan(); // Refresh data
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menghapus penjualan' };
    }
  };

  const exportExcelPenjualan = async (filters) => {
    try {
      const response = await axiosClient.get(endpoints.admin.report.penjualan, {
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'Laporan_Penjualan.xlsx';
      if (contentDisposition) {
         const match = contentDisposition.match(/filename="?([^"]+)"?/);
         if (match && match[1]) filename = match[1];
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Gagal mengunduh laporan excel' };
    }
  };

  const [activeTab, setActiveTab] = useState('Semua');

  const filteredPenjualan = penjualan.filter(item => {
    const searchMatch = (item.user?.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                        (item.invoiceNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    let tabMatch = true;
    if (activeTab === 'Sudah Bayar') {
      const ps = (item.paymentStatus || item.status_pembayaran || '').toLowerCase();
      tabMatch = ps === 'paid' || ps === 'settlement' || ps === 'capture';
    } else if (activeTab === 'Belum Bayar') {
      const ps = (item.paymentStatus || item.status_pembayaran || '').toLowerCase();
      tabMatch = !(ps === 'paid' || ps === 'settlement' || ps === 'capture');
    } else if (activeTab !== 'Semua') {
      tabMatch = (item.orderStatus || 'pending') === activeTab;
    }
    return searchMatch && tabMatch;
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResiModalOpen, setIsResiModalOpen] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDetail, setItemToDetail] = useState(null);
  const [itemToResi, setItemToResi] = useState(null);
  
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredPenjualan.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProduk]);

  const paginatedPenjualan = filteredPenjualan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const displayToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (item) => {
    setItemToDetail(item);
    setIsDetailModalOpen(true);
  };

  const handleResiClick = (item) => {
    setItemToResi(item);
    setIsResiModalOpen(true);
  };

  const handleExportClick = () => setIsExportModalOpen(true);

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const res = await hapusPenjualan(itemToDelete);
      if (res.success) {
        displayToast(res.message, "success");
      } else {
        displayToast(res.message, "error");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmExport = async (filters) => {
    const res = await exportExcelPenjualan(filters);
    if (res.success) {
      displayToast('Laporan berhasil diunduh', "success");
      setIsExportModalOpen(false);
    } else {
      displayToast(res.message || 'Gagal mengunduh laporan', "error");
    }
  };

  const handleStatusChange = async (idPenjualan, newStatus) => {
    const res = await updateStatus(idPenjualan, newStatus);
    if (res.success) {
      displayToast(res.message, "success");
    } else {
      displayToast(res.message, "error");
    }
  };

  const handleConfirmResi = async (idPenjualan, nomorResi) => {
    const res = await inputResi(idPenjualan, nomorResi);
    if (res.success) {
      displayToast(res.message, "success");
      setIsResiModalOpen(false);
      setItemToResi(null);
    } else {
      displayToast(res.message, "error");
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    filterProduk,
    setFilterProduk,
    activeTab,
    setActiveTab,
    filteredPenjualan,
    penjualan,
    isLoading,
    error,
    fetchPenjualan,
    updateStatus,
    inputResi,
    hapusPenjualan,
    exportExcelPenjualan,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isResiModalOpen,
    setIsResiModalOpen,
    itemToDelete,
    setItemToDelete,
    itemToDetail,
    setItemToDetail,
    itemToResi,
    setItemToResi,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    showToast,
    setShowToast,
    currentPage,
    setCurrentPage,
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
