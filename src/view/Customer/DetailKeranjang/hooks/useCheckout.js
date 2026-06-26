import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * CUSTOM HOOK: useCheckout
 * =========================================================================
 * Hook ini mengelola seluruh logika checkout belanja customer, meliputi:
 * 1. Mengambil alamat pengiriman customer dari backend.
 * 2. Mengambil tarif ongkos kirim (RajaOngkir) secara dinamis & caching.
 * 3. Menyimpan transaksi dan memicu gateway pembayaran Midtrans Snap.
 */
export function useCheckout({
  isOpen,
  onClose,
  selectedItems,
  totalAmount,
  appliedVoucher,
  fetchCart
}) {
  const navigate = useNavigate();
  // --- STATE MANAGEMENT ---
  const [discountAmount, setDiscountAmount] = useState(0); // Nominal diskon voucher
  const [paymentMethod, setPaymentMethod] = useState(''); // Metode pembayaran terpilih (BCA/Mandiri/dll)
  
  const [addresses, setAddresses] = useState([]); // Daftar alamat customer
  const [selectedAddressId, setSelectedAddressId] = useState(''); // ID Alamat pengiriman aktif
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Kontrol dropdown alamat
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' }); // Toast Notifikasi

  const [shippingCosts, setShippingCosts] = useState([]); // Daftar opsi kurir & tarif ongkir
  const [isLoadingShipping, setIsLoadingShipping] = useState(false); // Status loading tarif ongkir
  const [shippingCache, setShippingCache] = useState({}); // Cache internal di state React
  const [selectedShipping, setSelectedShipping] = useState(null); // Opsi pengiriman terpilih

  const [isCheckingOut, setIsCheckingOut] = useState(false); // Status loading transaksi checkout

  // Efek samping: Reset state modal saat modal checkout dibuka
  useEffect(() => {
    if (isOpen) {
      if (appliedVoucher) {
        setDiscountAmount(appliedVoucher.diskon_nominal ?? appliedVoucher.diskon ?? 0);
      } else {
        setDiscountAmount(0);
      }
      setPaymentMethod('');
      fetchAddresses();
    }
  }, [isOpen, appliedVoucher]);

  // Mengambil daftar alamat customer dari server backend
  const fetchAddresses = async () => {
    try {
      const response = await axiosClient.get(endpoints.customer.alamat);
      if (response.data?.status === 'success') {
        const fetchedAddresses = response.data.data;
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0) {
          const utama = fetchedAddresses.find(a => a.is_utama);
          setSelectedAddressId(utama ? utama.id : fetchedAddresses[0].id);
        }
      }
    } catch (error) {
      console.error('Gagal mengambil alamat:', error);
    }
  };

  // Efek samping: Hitung ulang ongkir ketika alamat berubah
  useEffect(() => {
    if (isOpen && selectedAddressId) {
      fetchShippingCosts(selectedAddressId);
    }
  }, [isOpen, selectedAddressId]);

  // Mengambil tarif ongkos kirim (API RajaOngkir) dengan sistem Caching
  const fetchShippingCosts = async (alamatId) => {
    const cartIds = selectedItems.map(item => item.idKeranjang || item.id);
    const cartIdsString = [...cartIds].sort().join(',');
    const cacheKey = `ongkir_${alamatId}_${cartIdsString}`;

    // A. Cek State Cache
    if (shippingCache[cacheKey]) {
      setShippingCosts(shippingCache[cacheKey]);
      setSelectedShipping(null);
      return;
    }

    // B. Cek Session Storage Cache
    const sessionData = sessionStorage.getItem(cacheKey);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      setShippingCosts(parsed);
      setShippingCache(prev => ({ ...prev, [cacheKey]: parsed }));
      setSelectedShipping(null);
      return;
    }

    setIsLoadingShipping(true);
    setShippingCosts([]);
    setSelectedShipping(null);

    try {
      const res = await axiosClient.post(endpoints.customer.rajaongkirCostByAddress, {
        idAlamat: alamatId,
        cart_ids: cartIds
      });

      if (res.data?.success) {
        const ongkirData = res.data.data;
        setShippingCosts(ongkirData);
        setShippingCache(prev => ({ ...prev, [cacheKey]: ongkirData }));
        sessionStorage.setItem(cacheKey, JSON.stringify(ongkirData));
      }
    } catch (error) {
      console.error("Gagal mengambil ongkir", error);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  // Memproses submit data checkout dan memicu pembayaran Midtrans Snap
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setToast({ isOpen: true, message: 'Harap lengkapi alamat pengiriman!', type: 'warning' });
      return;
    }

    if (!selectedShipping) {
      setToast({ isOpen: true, message: 'Harap pilih opsi pengiriman!', type: 'warning' });
      return;
    }

    if (!paymentMethod) {
      setToast({ isOpen: true, message: 'Harap pilih metode pembayaran!', type: 'warning' });
      return;
    }

    setIsCheckingOut(true);
    try {
      const payload = {
        cart_ids: selectedItems.map(item => item.idKeranjang || item.id),
        idAlamat: selectedAddressId,
        shippingCourier: selectedShipping.code,
        shippingService: selectedShipping.service,
        shippingCost: selectedShipping.value,
        idPromo: appliedVoucher ? appliedVoucher.idPromo : null,
        paymentMethod: paymentMethod === 'semua' ? [] : [paymentMethod]
      };

      const response = await axiosClient.post(endpoints.customer.checkout, payload);
      const responseData = response.data;
      
      if ((responseData?.success || responseData?.status === 'success') && responseData?.data?.snap_token) {
        fetchCart(); // Bersihkan keranjang di UI
        onClose(); // Tutup Modal
        
        // Munculkan Midtrans Snap
        setTimeout(() => {
          window.snap.pay(responseData.data.snap_token, {
            onSuccess: async function(result){
              try {
                await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id });
              } catch (e) { console.error('Gagal sinkronisasi status', e); }
              navigate('/ProfilCustomer/riwayat-pembelian');
            },
            onPending: async function(result){
              try {
                await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id });
              } catch (e) { console.error('Gagal sinkronisasi status', e); }
              navigate('/ProfilCustomer/riwayat-pembelian');
            },
            onError: async function(result){
              if (result && result.order_id) {
                 try { await axiosClient.post(endpoints.customer.checkStatus, { order_id: result.order_id }); } catch (e) {}
              }
              navigate('/ProfilCustomer/riwayat-pembelian');
            },
            onClose: function(){
              navigate('/ProfilCustomer/riwayat-pembelian');
            }
          });
        }, 300);
      } else {
        setToast({ isOpen: true, message: response.data?.message || 'Gagal membuat pesanan.', type: 'error' });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setToast({ isOpen: true, message: error.response?.data?.message || 'Terjadi kesalahan sistem saat checkout.', type: 'error' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Nilai total yang harus dibayar (Total belanja - diskon + ongkir)
  const grandTotal = totalAmount - discountAmount + (selectedShipping?.value || 0);
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return {
    discountAmount,
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isDropdownOpen,
    setIsDropdownOpen,
    toast,
    setToast,
    shippingCosts,
    isLoadingShipping,
    selectedShipping,
    setSelectedShipping,
    isCheckingOut,
    handleCheckout,
    grandTotal,
    selectedAddress
  };
}
