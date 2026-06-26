import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * CUSTOM HOOK: useRiwayatPembelian
 * =========================================================================
 * Hook ini mengelola seluruh logika bisnis untuk halaman riwayat pembelian customer:
 * 1. State data transaksi (orders), status loading, dan filter tab status pesanan.
 * 2. Mengambil riwayat pembelian dari database Laravel.
 * 3. Memproses pembayaran susulan menggunakan Midtrans Snap.
 * 4. Memproses konfirmasi pesanan selesai atau pembatalan pesanan.
 * 
 * @param {Function} navigate - Fungsi routing dari React Router untuk berpindah halaman
 */
export function useRiwayatPembelian() {
  const navigate = useNavigate();

  // --- 1. STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('diproses'); // Menyimpan tab status yang sedang aktif (diproses/dikirim/selesai/dibatalkan)
  const [orders, setOrders] = useState([]); // Menyimpan daftar riwayat pesanan/transaksi customer
  const [isLoading, setIsLoading] = useState(true); // Indikator loading saat mengambil data dari API
  
  // State toast notifikasi melayang
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  
  // State untuk modal konfirmasi aksi (cancel/receive)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, idPenjualan: null, action: 'receive' });
  
  // State untuk menampung data pesanan yang dipilih untuk dilihat rincian detailnya
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false); // Visibilitas modal rincian detail

  /**
   * HANDLER MEMBUKA DETAIL PESANAN
   */
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsModalDetailOpen(true);
  };

  /**
   * --- 2. FUNGSI MENGAMBIL RIWAYAT PESANAN DARI API ---
   */
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.customer.riwayatPembelian);
      const data = res.data?.data || res.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil riwayat pembelian", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data pertama kali saat halaman di-load
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * --- 3. LOGIKA INTEGRASI MIDTRANS SNAP (BAYAR SEKARANG) ---
   * Digunakan jika transaksi sebelumnya berstatus belum dibayar ('unpaid')
   */
  const handlePay = (snapToken) => {
    if (!snapToken) {
      setToast({ isOpen: true, message: "Token pembayaran tidak ditemukan. Harap hubungi admin.", type: 'error' });
      return;
    }
    
    // Periksa apakah SDK Midtrans Snap sudah dimuat di halaman index.html
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          // Jika sukses bayar, sinkronkan status pembayaran di backend
          try { await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id }); } catch (e) { }
          setToast({ isOpen: true, message: 'Pembayaran berhasil!', type: 'success' });
          fetchOrders(); // Refresh list data riwayat
        },
        onPending: async function (result) {
          // Jika pending (misal baru cetak kode pembayaran transfer)
          try { await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id }); } catch (e) { }
          setToast({ isOpen: true, message: 'Menunggu pembayaran!', type: 'warning' });
          fetchOrders();
        },
        onError: async function (result) {
          // Jika terjadi error pada Midtrans
          if (result && result.order_id) {
            try { await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id }); } catch (e) { }
          }
          setToast({ isOpen: true, message: 'Pembayaran gagal!', type: 'error' });
        },
        onClose: function () {
          // Callback jika user menutup widget popup
        }
      });
    } else {
      setToast({ isOpen: true, message: "Sistem pembayaran belum siap. Silakan refresh halaman.", type: 'error' });
    }
  };

  /**
   * --- 4. PENANGANAN MODAL KONFIRMASI AKSI ---
   */
  // Klik tombol "Pesanan Diterima"
  const handleConfirmClick = (id) => {
    setConfirmModal({ isOpen: true, idPenjualan: id, action: 'receive' });
  };

  // Klik tombol "Batalkan"
  const handleCancelClick = (id) => {
    setConfirmModal({ isOpen: true, idPenjualan: id, action: 'cancel' });
  };

  // Mengeksekusi aksi yang telah disetujui (Konfirmasi Penerimaan / Pembatalan)
  const processConfirm = async () => {
    const id = confirmModal.idPenjualan;
    const action = confirmModal.action;
    
    // Reset/tutup modal konfirmasi terlebih dahulu
    setConfirmModal({ isOpen: false, idPenjualan: null, action: null });
    
    try {
      // Kirim request PATCH ke backend Laravel (misal endpoint: /customer/penjualan/{id} dengan payload action)
      const res = await axiosClient.patch(`${endpoints.customer.konfirmasiDiterima}/${id}`, { action });
      
      if (res.data?.success || res.status === 200 || res.data?.status === 'success') {
         setToast({ 
           isOpen: true, 
           message: action === 'cancel' ? "Pesanan berhasil dibatalkan." : "Pesanan berhasil dikonfirmasi selesai.", 
           type: 'success' 
         });
         fetchOrders(); // Muat ulang data terbaru
      } else {
         setToast({ isOpen: true, message: "Gagal memproses pesanan.", type: 'error' });
      }
    } catch (error) {
      console.error("Gagal memproses aksi pesanan:", error);
      setToast({ isOpen: true, message: error.response?.data?.message || "Gagal memproses pesanan.", type: 'error' });
    }
  };

  /**
   * --- 5. LOGIKA FILTER TAB STATUS PESANAN ---
   * Memilah data dari array utama 'orders' berdasarkan tab yang sedang aktif saat ini.
   */
  const getFilteredOrders = () => {
    return orders.filter(order => {
      const status = (order.orderStatus || order.status || '').toLowerCase();
      
      // Tab Diproses: status belum bayar, sedang diproses, atau pending
      if (activeTab === 'diproses') {
        return status.includes('menunggu') || status.includes('proses') || status.includes('pending');
      }
      // Tab Dikirim: sedang dalam perjalanan kurir
      if (activeTab === 'dikirim') {
        return status.includes('kirim') || status.includes('perjalanan');
      }
      // Tab Selesai: barang sudah diterima/selesai
      if (activeTab === 'selesai') {
        return status.includes('selesai') || status.includes('terima');
      }
      // Tab Batal: dibatalkan sistem, kedaluwarsa, atau dibatalkan manual oleh customer
      if (activeTab === 'dibatalkan') {
        return status.includes('batal') || status.includes('expire');
      }
      return false;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Ekspor seluruh fungsi dan variabel agar bisa dikonsumsi oleh RiwayatPembelian.jsx
  return {
    activeTab,
    setActiveTab,
    orders,
    isLoading,
    toast,
    setToast,
    confirmModal,
    setConfirmModal,
    selectedOrder,
    setSelectedOrder,
    isModalDetailOpen,
    setIsModalDetailOpen,
    handleOpenDetail,
    handlePay,
    handleConfirmClick,
    handleCancelClick,
    processConfirm,
    filteredOrders,
    fetchOrders,
    navigate,
  };
}
