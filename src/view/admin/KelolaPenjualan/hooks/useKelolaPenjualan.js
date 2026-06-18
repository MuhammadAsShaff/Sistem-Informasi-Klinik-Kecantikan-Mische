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
    
    const tabMatch = activeTab === 'Semua' || (item.orderStatus || 'pending') === activeTab;
    
    // Nanti filterProduk bisa diimplementasi jika produk benar-benar disaring
    return searchMatch && tabMatch;
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

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
    exportExcelPenjualan
  };
};
