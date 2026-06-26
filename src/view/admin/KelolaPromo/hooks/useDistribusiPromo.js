import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * CUSTOM HOOK: useDistribusiPromo
 * =========================================================================
 * Hook ini mengelola logika distribusi promo ke customer:
 * 1. Mengambil data customer secara dinamis dengan filter pencarian dari API.
 * 2. Mengelola status checkbox pemilihan customer (satu per satu atau semua).
 * 3. Mengirimkan payload distribusi ke endpoint backend Laravel.
 */
export function useDistribusiPromo({ isOpen, onClose, promo, showToast }) {
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
      setTargetType('Pilih Customer');
      setSearchQuery('');
      setSelectedCustomers([]);
      fetchCustomers('');
    }
  }, [isOpen, promo]);

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

  // Mengirimkan distribusi promo ke server backend
  const handleDistribute = async () => {
    if (targetType === 'Pilih Customer' && selectedCustomers.length === 0) {
      showToast('Pilih minimal satu customer untuk mendistribusikan promo.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        idPromo: promo?.idPromo || promo?.id_promo || promo?.id,
        type: targetType === 'Semua Customer' ? 'all' : 'selected',
        customer_ids: targetType === 'Semua Customer' ? [] : selectedCustomers
      };

      const res = await axiosClient.post(endpoints.admin.distribusi.promo, payload);
      if (res.data?.status === 'success') {
        const promoName = promo?.namaPromo || promo?.nama || 'ini';
        showToast(`Promo "${promoName}" berhasil didistribusikan!`, 'success');
        onClose();
      }
    } catch (error) {
      console.error("Gagal mendistribusikan promo:", error);
      showToast(error.response?.data?.message?.idPromo?.[0] || error.response?.data?.message || "Gagal mendistribusikan promo", "error");
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
