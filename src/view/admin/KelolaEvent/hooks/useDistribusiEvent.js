import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * CUSTOM HOOK: useDistribusiEvent
 * =========================================================================
 * Hook ini mengelola logika distribusi event ke customer:
 * 1. Mengambil data customer secara dinamis dengan filter pencarian dari API.
 * 2. Mengelola status checkbox pemilihan customer (satu per satu atau semua).
 * 3. Mengirimkan payload distribusi ke endpoint backend Laravel untuk event.
 */
export function useDistribusiEvent({ isOpen, onClose, event, showToast }) {
  const [targetType, setTargetType] = useState('Pilih Customer'); // Jenis target: 'Pilih Customer' atau 'Semua Customer'
  const [searchQuery, setSearchQuery] = useState(''); // Kata kunci pencarian customer
  const [selectedCustomers, setSelectedCustomers] = useState([]); // Array ID customer terpilih
  const [customers, setCustomers] = useState([]); // Array data customer dari server
  const [isFetching, setIsFetching] = useState(false); // Status loading ambil data customer
  const [isSubmitting, setIsSubmitting] = useState(false); // Status loading kirim distribusi

  // Mengambil daftar customer dari API
  const fetchCustomers = async (search = '') => {
    setIsFetching(true);
    try {
      const url = search ? `${endpoints.admin.distribusi.customers}?search=${encodeURIComponent(search)}` : endpoints.admin.distribusi.customers;
      const res = await axiosClient.get(url);
      console.log('Distribusi Customers Response:', res.data); // DEBUG: Lihat struktur data
      if (res.data?.status === 'success') {
        // Map data agar seragam: idUser menjadi id, nama menjadi name, nomorWa menjadi phone
        setCustomers(res.data.data.map(c => ({ id: c.idUser, name: c.nama, phone: c.nomorWa })));
      }
    } catch (error) {
      console.error("Gagal mengambil data customer:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Efek samping: Reset data modal saat modal distribusi dibuka
  useEffect(() => {
    if (isOpen) {
      console.log('Event terpilih untuk didistribusikan:', event); // DEBUG: Lihat id nya apa
      setTargetType('Pilih Customer');
      setSearchQuery('');
      setSelectedCustomers([]);
      fetchCustomers('');
    }
  }, [isOpen, event]);

  // Efek samping: Jika memilih 'Semua Customer', otomatis centang semua ID customer
  useEffect(() => {
    if (targetType === 'Semua Customer') {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  }, [targetType, customers]);

  // Handler saat checkbox customer diklik
  const handleCheckboxChange = (id) => {
    if (targetType === 'Semua Customer') return; // Jika memilih semua, tolak perubahan checkbox manual
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Mengirimkan distribusi event ke server backend
  const handleDistribute = async () => {
    if (targetType === 'Pilih Customer' && selectedCustomers.length === 0) {
      showToast('Pilih minimal satu customer untuk mendistribusikan event.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        idEvent: event?.idEvent || event?.idKegiatan || event?.id,
        type: targetType === 'Semua Customer' ? 'all' : 'selected',
        customer_ids: targetType === 'Semua Customer' ? [] : selectedCustomers
      };
      
      console.log("Mencoba mengirim payload distribusi event:", payload);

      const res = await axiosClient.post(endpoints.admin.distribusi.event, payload);
      if (res.data?.status === 'success') {
        const eventName = event?.namaKegiatan || event?.nama || 'ini';
        showToast(`Event "${eventName}" berhasil didistribusikan!`, 'success');
        onClose();
      }
    } catch (error) {
      console.error("Gagal mendistribusikan event:", error);
      showToast(error.response?.data?.message?.idKegiatan?.[0] || error.response?.data?.message || "Gagal mendistribusikan event", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    targetType,
    setTargetType,
    searchQuery,
    setSearchQuery,
    selectedCustomers,
    setSelectedCustomers,
    customers,
    isFetching,
    isSubmitting,
    fetchCustomers,
    handleCheckboxChange,
    handleDistribute
  };
}
