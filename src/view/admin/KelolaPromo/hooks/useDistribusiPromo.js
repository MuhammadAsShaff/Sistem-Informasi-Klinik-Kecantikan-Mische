import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN KURIR PENGANTAR SELEBARAN PROMO (useDistribusiPromo)
 * =========================================================================
 * Ibarat asisten khusus yang bertugas membagikan selebaran promo ke rumah para pelanggan.
 * Tugas utama asisten ini meliputi:
 * 1. Membuka buku besar berisi daftar nama pelanggan (fetchCustomers).
 * 2. Mencatat siapa saja yang ingin dikirimi selebaran (bisa pilih satu-satu atau borongan semua).
 * 3. Mengemas promo dan menyerahkannya kepada kurir pengantar (handleDistribute) untuk dikirim ke WhatsApp/sistem.
 */
export function useDistribusiPromo({ isOpen, onClose, promo, showToast }) {
  // Saklar penentu apakah ingin pilih-pilih pelanggan atau kirim borongan ke semua orang
  const [targetType, setTargetType] = useState('Pilih Customer'); 
  // Kotak ketikan untuk mencari nama pelanggan tertentu di buku besar
  const [searchQuery, setSearchQuery] = useState(''); 
  // Daftar tanda centang untuk pelanggan yang terpilih
  const [selectedCustomers, setSelectedCustomers] = useState([]); 
  // Laci penyimpanan seluruh daftar pelanggan dari gudang data
  const [customers, setCustomers] = useState([]); 
  // Rambu penanda asisten sedang sibuk membaca buku pelanggan
  const [isFetching, setIsFetching] = useState(false); 
  // Rambu penanda kurir sedang mengantar selebaran di perjalanan
  const [isSubmitting, setIsSubmitting] = useState(false); 

  /**
   * TUGAS MEMBACA BUKU PELANGGAN (fetchCustomers)
   * Asisten pergi ke gudang arsip (API) untuk mengambil daftar pelanggan.
   * Jika ada kata kunci, asisten hanya menyalin nama yang cocok dengan kata kunci tersebut.
   */
  const fetchCustomers = async (search = '') => {
    setIsFetching(true); // Nyalakan lampu sibuk membaca
    try {
      const url = search ? `${endpoints.admin.distribusi.customers}?search=${encodeURIComponent(search)}` : endpoints.admin.distribusi.customers;
      const res = await axiosClient.get(url);
      if (res.data?.status === 'success') {
        // Asisten merapikan format catatan agar mudah dibaca: idUser jadi id, nama jadi name, nomorWa jadi phone
        setCustomers(res.data.data.map(c => ({ id: c.idUser, name: c.nama, phone: c.nomorWa })));
      }
    } catch (error) {
      console.error("Gagal mengambil data customer:", error);
    } finally {
      setIsFetching(false); // Matikan lampu sibuk membaca
    }
  };

  /**
   * EFEK SAMPING: MEMBERSIHKAN MEJA KETIKA BILIK DIBUKA
   * Setiap kali meja kerja distribusi dibuka, asisten langsung membersihkan sisa catatan lama
   * dan mengambil buku daftar pelanggan yang paling segar.
   */
  useEffect(() => {
    if (isOpen) {
      setTargetType('Pilih Customer');
      setSearchQuery('');
      setSelectedCustomers([]);
      fetchCustomers('');
    }
  }, [isOpen, promo]);

  /**
   * EFEK SAMPING: CENTANG OTOMATIS JIKA BORONGAN
   * Jika admin menggeser saklar ke "Semua Customer", asisten langsung mencentang semua nama.
   * Jika dikembalikan ke "Pilih Customer", asisten menghapus semua centang agar admin bisa memilih sendiri.
   */
  useEffect(() => {
    if (targetType === 'Semua Customer') {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  }, [targetType, customers]);

  /**
   * TUGAS MENCENTANG NAMA PELANGGAN (handleCheckboxChange)
   * Ketika admin mengetuk kotak di sebelah nama pelanggan, asisten menambahkannya ke daftar kirim.
   * Jika sudah ada, asisten mencoretnya dari daftar kirim.
   */
  const handleCheckboxChange = (id) => {
    if (targetType === 'Semua Customer') return; // Jika borongan, larang admin utak-atik centang satuan
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  /**
   * TUGAS UTUS KURIR PENGANTAR SELEBARAN (handleDistribute)
   * Asisten mengumpulkan semua nomor tujuan, menempelkan kode promo, lalu mengutus kurir.
   */
  const handleDistribute = async () => {
    // Pencegahan: Jika tidak ada satupun pelanggan yang dicentang, asisten akan menegur
    if (targetType === 'Pilih Customer' && selectedCustomers.length === 0) {
      showToast('Pilih minimal satu customer untuk mendistribusikan promo.', 'error');
      return;
    }

    setIsSubmitting(true); // Nyalakan lampu tanda kurir sedang berlari mengantar
    try {
      // Bungkusan paket berisi ID promo dan daftar ID pelanggan tujuan
      const payload = {
        idPromo: promo?.idPromo || promo?.id_promo || promo?.id,
        type: targetType === 'Semua Customer' ? 'all' : 'selected',
        customer_ids: targetType === 'Semua Customer' ? [] : selectedCustomers
      };

      const res = await axiosClient.post(endpoints.admin.distribusi.promo, payload);
      if (res.data?.status === 'success') {
        const promoName = promo?.namaPromo || promo?.nama || 'ini';
        showToast(`Promo "${promoName}" berhasil didistribusikan!`, 'success');
        onClose(); // Tutup meja kerja setelah berhasil
      }
    } catch (error) {
      console.error("Gagal mendistribusikan promo:", error);
      showToast(error.response?.data?.message?.idPromo?.[0] || error.response?.data?.message || "Gagal mendistribusikan promo", "error");
    } finally {
      setIsSubmitting(false); // Matikan lampu tanda kurir berlari
    }
  };

  // Asisten menyerahkan seluruh laci, saklar, dan tombol kepada komponen tampilan (view)
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
