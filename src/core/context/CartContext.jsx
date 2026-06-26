import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import gambarProduk from '@/assets/images/Gambar_Produk.png';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/* 
 * =========================================================================
 * CART CONTEXT (STASIUN PEMANCAR DATA KERANJANG BELANJA)
 * =========================================================================
 * Context ini ibarat "Stasiun Pemancar Radio/TV". Dia menyimpan semua data keranjang 
 * belanja, lalu memancarkannya ke seluruh komponen di website. Jadi, halaman apapun 
 * (seperti Navbar di atas, Halaman Produk, atau Halaman Keranjang) bisa langsung 
 * mengambil dan memakai datanya tanpa perlu mengulang ngetik kode yang sama.
 */

// Membuat "Stasiun Pemancar" kosong
const CartContext = createContext();

// Membuat alat "Penerima Sinyal" (Antena) agar halaman lain bisa ikut menikmati datanya
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // =========================================================================
  // 1. KOTAK PENYIMPANAN DATA (STATE)
  // =========================================================================
  const [cartItems, setCartItems] = useState([]); // Menyimpan daftar barang di dalam keranjang
  const [voucherCode, setVoucherCode] = useState(''); // Menyimpan teks kode voucher yang sedang diketik
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Menyimpan info voucher JIKA sukses dipakai
  const [voucherError, setVoucherError] = useState(''); // Menyimpan pesan error JIKA voucher salah/kedaluwarsa
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', message: '' }); // Mengatur pop-up notifikasi melayang
  const [isCartLoading, setIsCartLoading] = useState(true); // Penanda apakah sedang mengambil data dari server

  // Fungsi untuk memunculkan notifikasi pop-up (Modal) dan menutupnya otomatis dalam 2 detik
  const showModal = useCallback((type, message) => {
    setModalConfig({ isOpen: true, type, message });
    setTimeout(() => {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, 2000);
  }, []);

  // =========================================================================
  // 2. FUNGSI MENGAMBIL DATA KERANJANG DARI DATABASE BACKEND
  // =========================================================================
  const fetchCart = useCallback(async () => {
    // Jika user belum login (tidak punya tiket/token), kosongkan saja keranjangnya dan batalkan misi.
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      setCartItems([]);
      setAppliedVoucher(null);
      setVoucherCode('');
      setIsCartLoading(false);
      return;
    }
    
    setIsCartLoading(true);
    try {
      // Menyuruh kurir (axios) meminta/mengambil data keranjang ke kantor Backend
      const res = await axiosClient.get(endpoints.customer.cart);
      if (res.data.success) {
        const rawData = res.data.data || [];
        
        // Merapikan bentuk data dari Backend agar sesuai dengan "bahasa" yang diminta Frontend
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
            // Kembalikan status 'dicentang/dipilih' ke seperti sebelumnya (agar centangnya tidak hilang saat halamannya di-refresh)
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

  // Otomatis jalankan fungsi pengambilan data keranjang (fetchCart) saat website pertama kali dibuka
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // =========================================================================
  // 3. FUNGSI MENAMBAH BARANG KE KERANJANG
  // =========================================================================
  const addToCart = async (product, qty = 1) => {
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      showModal('error', 'untuk melakukan pembelian produk kamu harus registrasi atau login terlebih dahulu ya');
      return;
    }

    try {
      const idProduk = product.idProduk || product.id;
      // Kurir membawa/mengirim (POST) data id_produk dan jumlahnya ke server
      const res = await axiosClient.post(endpoints.customer.cart, {
        idProduk: idProduk,
        jumlahProduk: qty
      });
      if (res.data.success) {
        showModal('success', 'Produk berhasil ditambahkan ke keranjang');
        fetchCart(); // Jika sukses ditambahkan, ambil ulang data terbaru dari server
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  // =========================================================================
  // 4. FUNGSI MENGHAPUS BARANG DARI KERANJANG
  // =========================================================================
  const removeFromCart = async (id) => {
    try {
      // Kurir menyuruh server menghapus data (DELETE) berdasarkan ID
      const res = await axiosClient.delete(`${endpoints.customer.cart}/${id}`);
      if (res.data.success) {
        fetchCart(); // Ambil ulang data agar keranjangnya ter-update di layar
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal menghapus produk dari keranjang');
    }
  };

  // =========================================================================
  // 5. FUNGSI MENAMBAH / MENGURANGI JUMLAH BARANG (TOMBOL + ATAU -)
  // =========================================================================
  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta; // delta itu angka tambahnya (misal +1 atau -1)
    if (newQty < 1) return; // Jangan biarkan jumlah diubah menjadi 0 (kalau mau 0 harus lewat tombol hapus)

    // Optimistic Update: Frontend langsung mengubah angkanya di layar agar terasa instan (tidak nge-lag),
    // sambil menunggu si kurir selesai melapor ke Backend.
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );

    try {
      // Menyuruh kurir melapor (PATCH/Update) ke server bahwa angkanya telah berubah
      const res = await axiosClient.patch(`${endpoints.customer.cart}/${id}`, {
        jumlahProduk: newQty
      });
      if (!res.data.success) {
        fetchCart(); // JIKA di server ternyata gagal, kembalikan angkanya di layar seperti semula
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal mengubah jumlah produk');
      fetchCart(); 
    }
  };

  // =========================================================================
  // 6. FUNGSI MENCENTANG KOTAK (CHECKBOX) BARANG
  // =========================================================================
  const handleToggleSelect = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // =========================================================================
  // 7. FUNGSI MENYIMPAN TEKS KODE VOUCHER SAAT DIKETIK
  // =========================================================================
  const handleVoucherChange = (e) => {
    setVoucherCode(e.target.value);
  };

  // =========================================================================
  // 8. FUNGSI MENGECEK APAKAH VOUCHERNYA ASLI ATAU PALSU KE SERVER
  // =========================================================================
  const applyVoucher = async (code) => {
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
        setAppliedVoucher(res.data.data); // Promo Valid (Asli)! Simpan datanya.
      } else {
        setAppliedVoucher(null); // Promo Ditolak
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

  // FUNGSI MEMPERCANTIK FORMAT ANGKA MENJADI RUPIAH (Contoh: 50000 -> Rp 50.000)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // =========================================================================
  // 9. KALKULATOR PINTAR (USEMEMO)
  // useMemo adalah "kalkulator pintar" yang akan menghitung ulang HANYA JIKA datanya berubah.
  // Ini sangat menghemat performa komputer/HP pelanggan.
  // =========================================================================

  // Menghitung barang mana saja yang sedang dicentang (selected)
  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems]
  );

  // Menghitung Total Harga (Harga x Jumlah) dari semua barang yang sedang dicentang saja
  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  // Menghitung total banyaknya kotak (quantity) barang di dalam keranjang
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // =========================================================================
  // 10. MENGUMPULKAN SEMUA FUNGSI KE DALAM SATU TAS (Value)
  // =========================================================================
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
    fetchCart,
  };

  return (
    // =========================================================================
    // 11. MENYIARKAN ISI TAS KE SELURUH HALAMAN (Provider)
    // =========================================================================
    <CartContext.Provider value={value}>
      {children}
      
      {/* Global Cart Modal (Notifikasi Melayang) */}
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
