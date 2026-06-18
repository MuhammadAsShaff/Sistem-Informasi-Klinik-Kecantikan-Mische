import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import gambarProduk from '@/assets/images/Gambar_Produk.png';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', message: '' });

  const showModal = useCallback((type, message) => {
    setModalConfig({ isOpen: true, type, message });
    setTimeout(() => {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, 2000);
  }, []);

  const [isCartLoading, setIsCartLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    // Cek token secara aman (opsional, axios interceptor biasanya handle, tapi mencegah hit API jika belum login)
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      setIsCartLoading(false);
      return;
    }
    
    setIsCartLoading(true);
    try {
      const res = await axiosClient.get(endpoints.customer.cart);
      if (res.data.success) {
        const rawData = res.data.data || [];
        const mappedData = rawData.map(item => ({
          id: item.idKeranjang,
          idProduk: item.idProduk,
          name: item.produk?.nama || item.produk?.namaProduk || 'Produk',
          price: item.produk?.harga || 0,
          quantity: item.jumlahProduk,
          image: item.produk?.gambar || item.produk?.foto || gambarProduk,
        }));

        setCartItems(prev => {
          return mappedData.map(newItem => {
            const oldItem = prev.find(i => i.id === newItem.id);
            return { ...newItem, selected: oldItem ? oldItem.selected : true };
          });
        });
      }
    } catch (error) {
      console.error('Gagal mengambil keranjang', error);
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, qty = 1) => {
    try {
      const idProduk = product.idProduk || product.id;
      const res = await axiosClient.post(endpoints.customer.cart, {
        idProduk: idProduk,
        jumlahProduk: qty
      });
      if (res.data.success) {
        showModal('success', 'Produk berhasil ditambahkan ke keranjang');
        fetchCart();
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.customer.cart}/${id}`);
      if (res.data.success) {
        fetchCart();
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal menghapus produk dari keranjang');
    }
  };

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return; // Jangan biarkan jumlah 0

    // Optimistic update locally
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );

    try {
      const res = await axiosClient.patch(`${endpoints.customer.cart}/${id}`, {
        jumlahProduk: newQty
      });
      if (!res.data.success) {
        fetchCart(); // Revert on failure
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal mengubah jumlah produk');
      fetchCart(); // Revert on failure
    }
  };

  const handleToggleSelect = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleVoucherChange = (e) => {
    setVoucherCode(e.target.value);
  };

  const applyVoucher = async (code) => {
    // If called from onClick, 'code' will be an Event object, not a string
    const kode = typeof code === 'string' ? code : voucherCode;
    if (!kode) return;
    
    setVoucherError('');
    try {
      const cart_ids = selectedItems.map(item => item.id);
      const res = await axiosClient.post(endpoints.customer.promoCheck, {
        kode,
        cart_ids
      });
      if (res.data.success) {
        setAppliedVoucher(res.data.data);
      } else {
        setAppliedVoucher(null);
        setVoucherError(res.data.message || 'Promo ditolak oleh sistem.');
      }
    } catch (error) {
      console.error('Error Cek Promo:', error);
      let errMsg = 'Gagal mengecek promo.';
      if (error.response) {
        if (error.response.data?.message) {
          errMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string' && error.response.data.includes('<html')) {
          errMsg = `Sistem Backend Error (HTML Response ${error.response.status}). Cek Network tab.`;
        } else {
          errMsg = `Error ${error.response.status}: Route mungkin tidak ditemukan atau terjadi kesalahan server.`;
        }
      }
      setVoucherError(errMsg);
      setAppliedVoucher(null);
    }
  };

  const handleCheckout = () => {
    console.log('Checkout with total:', totalAmount);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems]
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    selectedItems,
    totalAmount,
    voucherCode,
    cartCount,
    addToCart,
    removeFromCart,
    handleQuantityChange,
    handleToggleSelect,
    handleVoucherChange,
    applyVoucher,
    handleCheckout,
    formatRupiah,
    appliedVoucher,
    setAppliedVoucher,
    voucherError,
    isCartLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Global Cart Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 max-w-sm mx-4 transform transition-all animate-in zoom-in-95 duration-200">
            {modalConfig.type === 'success' ? (
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#56BC36]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {modalConfig.type === 'success' ? 'Berhasil!' : 'Oops!'}
              </h3>
              <p className="text-sm text-gray-500">{modalConfig.message}</p>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};
