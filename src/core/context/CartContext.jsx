import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
// Mengimpor gambar bawaan sebagai cadangan (ban serep) jika produk dari server lupa diberi foto
import gambarProduk from '@/assets/images/Gambar_Produk.png';

// Mengimpor 'axiosClient', ibarat asisten kurir khusus yang memegang kunci komunikasi ke kantor backend
import axiosClient from '@/core/api/axiosClient';

// Mengimpor 'endpoints', yaitu buku daftar alamat rute di kantor backend
import { endpoints } from '@/core/api/endpoints';

/** 
 * =========================================================================
 * STASIUN PEMANCAR DATA KERANJANG BELANJA (CartContext)
 * =========================================================================
 * Bayangkan file ini sebagai "Stasiun Pemancar Radio/TV Pusat" di dalam website Mische.
 * Dia menyimpan seluruh perbekalan keranjang belanja (daftar barang, total harga, 
 * voucher diskon), lalu memancarkan sinyal datanya ke seantero website.
 * 
 * Hasilnya: Halaman apapun di website ini (mulai dari ikon keranjang di pojok atas/Navbar, 
 * Halaman Katalog Produk, hingga Halaman Kasir/Checkout) bisa langsung menangkap sinyal ini 
 * dan memakai datanya tanpa perlu ribet mengulang-ulang kode yang sama!
 */

// 1. Membuat "Menara Stasiun Pemancar" (awalnya masih kosong belum ada siarannya)
const CartContext = createContext();

// 2. Membuat "Antena Penerima Sinyal" (Custom Hook) agar halaman lain tinggal pasang antena ini untuk menikmati siaran keranjang belanja
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // =========================================================================
  // 1. LACI-LACI PENYIMPANAN DATA STASIUN (STATE)
  // =========================================================================

  // Laci 1: Tempat menampung deretan barang yang sudah diambil pelanggan ke dalam keranjang
  const [cartItems, setCartItems] = useState([]); 
  
  // Laci 2: Kertas buram tempat mencatat ketikan kode voucher yang sedang diketik pelanggan
  const [voucherCode, setVoucherCode] = useState(''); 
  
  // Laci 3: Kotak kaca tempat memajang kupon diskon JIKA vouchernya sudah dicek dan terbukti asli (valid)
  const [appliedVoucher, setAppliedVoucher] = useState(null); 
  
  // Laci 4: Kotak peringatan merah tempat menaruh kalimat keluhan JIKA kode voucher ternyata palsu atau kedaluwarsa
  const [voucherError, setVoucherError] = useState(''); 
  
  // Laci 5: Pusat kendali pop-up melayang di layar (menyimpan info apakah pop-up sedang tayang, jenis warnanya, dan kalimat pesannya)
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', message: '' }); 
  
  // Laci 6: Rambu tanda sibuk ('true') saat kurir sedang berlari mengambil isi keranjang ke kantor backend
  const [isCartLoading, setIsCartLoading] = useState(true); 

  /**
   * PENGENDALI POP-UP OTOMATIS HILANG (showModal)
   * Dibungkus dengan `useCallback` (Perekam Instruksi Abadi) agar stasiun tidak perlu 
   * mencetak ulang instruksi ini setiap kali ada perubahan kecil di layar.
   * Tugasnya: Membuka pop-up pesan, lalu memasang alarm (setTimeout) untuk menutupnya secara otomatis setelah 2 detik (2000 milidetik).
   */
  const showModal = useCallback((type, message) => {
    setModalConfig({ isOpen: true, type, message });
    setTimeout(() => {

      // Menggunakan laci 'prev' (kondisi sebelumnya) agar tidak merusak data lain saat mematikan saklar isOpen
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, 2000);
  }, []);

  // =========================================================================
  // 2. TUGAS MENJEMPUT DATA KERANJANG DARI SERVER BACKEND
  // =========================================================================
  /**
   * Fungsi pamungkas untuk menyuruh asisten kurir mengambil catatan keranjang di database backend.
   * Menggunakan `useCallback` agar instruksinya tetap stabil dan tidak memicu perputaran tanpa henti di useEffect.
   */
  const fetchCart = useCallback(async () => {
    /*
      PEMERIKSAAN KARTU IDENTITAS (LOGIN TOKEN)
      Kita periksa dompet utama (localStorage) dan saku celana (sessionStorage) pelanggan.
      Jika tidak ada tiket/token bukti login, berarti pelanggan ini belum terdaftar.
      Tindakan kita: langsung kosongkan keranjang, bersihkan voucher, matikan tanda sibuk, dan batalkan misi!
    */
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      setCartItems([]);
      setAppliedVoucher(null);
      setVoucherCode('');
      setIsCartLoading(false);
      return;
    }
    
    setIsCartLoading(true); // Nyalakan rambu tanda sibuk (loading)
    try {
      // Menyuruh kurir (axiosClient) pergi meminta data keranjang ke kantor Backend (metode GET)
      const res = await axiosClient.get(endpoints.customer.cart);
      
      // Jika kantor backend tersenyum dan menyatakan pengiriman sukses
      if (res.data.success) {

        // Ambil bungkusan isi keranjangnya, jika kosong kita siapkan laci kosong []
        const rawData = res.data.data || [];
        
        /*
          TUGAS PENERJEMAH BAHASA (DATA MAPPING)
          Kantor Backend punya cara penamaan yang beraneka ragam (misal: idProduk, namaProduk, jumlahProduk, foto).
          Di sini kita seragamkan dan rapikan bajunya menjadi bahasa standar yang mudah dicerna web kita 
          (id, name, price, quantity, image).
        */
        const mappedData = rawData.map(item => ({
          id: item.idKeranjang,
          idProduk: item.idProduk,
          name: item.produk?.nama || item.produk?.namaProduk || 'Produk',
          price: item.produk?.harga || 0,
          quantity: item.jumlahProduk,

          // Jika server lupa memberi foto, kita tempelkan 'gambarProduk' sebagai ban serep
          image: item.produk?.gambar || item.produk?.foto || gambarProduk,
        }));

        /*
          MEMPERBARUI KOTAK TANPA KEHILANGAN CENTANGAN
          Saat data baru masuk, kita intip laci keranjang yang lama (prev). 
          Jika sebelumnya pelanggan sudah mencentang (selected) atau batal mencentang barang tersebut, 
          kita tempelkan kembali status centangannya agar tidak mendadak mereset saat halaman menyegarkan diri.
        */
        setCartItems(prev => {
          return mappedData.map(newItem => {
            const oldItem = prev.find(i => i.id === newItem.id);
            return { ...newItem, selected: oldItem ? oldItem.selected : true };
          });
        });
      }
    } catch (error) {

      // Jika kurir tersesat atau koneksi putus, catat kesalahannya di buku harian browser
      console.error('Gagal mengambil keranjang', error);
    } finally {
      setIsCartLoading(false); // Kurir sudah pulang, matikan rambu tanda sibuk
    }
  }, []);

  /**
   * PENYALA OTOMATIS SAAT WEBSITE DIBUKA (SIDE EFFECT)
   * Begitu pelanggan membuka website Mische, asisten otomatis menjalankan fungsi `fetchCart()` 
   * untuk segera menghidangkan isi keranjang belanja mereka.
   */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // =========================================================================
  // 3. TUGAS MENAMBAHKAN BARANG BARU KE KERANJANG (addToCart)
  // =========================================================================
  const addToCart = async (product, qty = 1) => {
    
    // Penjaga Gerbang: Jika pelanggan belum login (tidak punya token), tolak dengan sopan lewat pop-up merah!
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      showModal('error', 'untuk melakukan pembelian produk kamu harus registrasi atau login terlebih dahulu ya');
      return;
    }

    try {
      // Mencari tahu nomor identitas produk (bisa bernama idProduk atau sekadar id)
      const idProduk = product.idProduk || product.id;
      
      // Asisten kurir berlari ke server membawa paket baru (metode POST) berisi nomor KTP produk dan jumlahnya
      const res = await axiosClient.post(endpoints.customer.cart, {
        idProduk: idProduk,
        jumlahProduk: qty
      });
      
      // Jika server memberi tanda jempol (success)
      if (res.data.success) {
        showModal('success', 'Produk berhasil ditambahkan ke keranjang'); // Munculkan pop-up hijau
        fetchCart(); // Mintakan daftar keranjang terupdate ke server agar ikon keranjang di atas langsung bertambah angkanya
      }
    } catch (error) {
      // Jika server menolak (misal stok habis atau sistem gangguan)
      showModal('error', error.response?.data?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  // =========================================================================
  // 4. TUGAS MEMBUANG BARANG DARI KERANJANG (removeFromCart)
  // =========================================================================
  const removeFromCart = async (id) => {
    try {
      // Kurir membawa surat penghancuran (metode DELETE) ke server khusus untuk ID barang tersebut
      const res = await axiosClient.delete(`${endpoints.customer.cart}/${id}`);
      if (res.data.success) {
        fetchCart(); // Segarkan ulang keranjang di layar agar barang yang dibuang seketika lenyap
      }
    } catch (error) {
      showModal('error', error.response?.data?.message || 'Gagal menghapus produk dari keranjang');
    }
  };

  // =========================================================================
  // 5. TUGAS MENGUBAH JUMLAH BARANG DENGAN KILAT (handleQuantityChange)
  // =========================================================================
  /**
   * Fungsi ini dipanggil saat pelanggan menekan tombol Plus (+) atau Minus (-).
   * Parameter 'delta' adalah angka perubahannya (misal +1 kalau ditambah, -1 kalau dikurangi).
   */
  const handleQuantityChange = async (id, delta) => {
    // Cari barang mana yang mau diubah angkanya di dalam laci keranjang
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    // Hitung jumlah baru (jumlah lama ditambah delta)
    const newQty = item.quantity + delta; 
    // Aturan Tegas: Jumlah barang tidak boleh di bawah 1 (kalau mau 0, pelanggan harus menekan ikon tong sampahnya langsung)
    if (newQty < 1) return; 

    /*
      TRIK "PELAYAN CEPAT TANGGAP" (OPTIMISTIC UPDATE)
      Pelanggan itu benci menunggu loading! Jadi, sebelum kurir kita sampai di kantor backend, 
      kita langsung ubah angka jumlah barang di layar browser pelanggan seketika itu juga. 
      Hasilnya: Tombol + dan - terasa sangat instan dan super mulus tanpa jeda!
    */
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );

    try {
      // Sementara layar sudah berubah, kurir kita baru sampai di server membawa laporan pembaruan angka (metode PATCH)
      const res = await axiosClient.patch(`${endpoints.customer.cart}/${id}`, {
        jumlahProduk: newQty
      });
      
      // Jika ternyata di server gagal (misal mendadak stok di gudang habis)
      if (!res.data.success) {
        fetchCart(); // Tarik ulang data asli dari server untuk membatalkan trik kilat tadi
      }
    } catch (error) {
      // Jika koneksi putus saat lapor ke server, munculkan pop-up error dan kembalikan angka di layar seperti semula
      showModal('error', error.response?.data?.message || 'Gagal mengubah jumlah produk');
      fetchCart(); 
    }
  };

  // =========================================================================
  // 6. TUGAS MENCENTANG KOTAK PILIHAN BARANG (handleToggleSelect)
  // =========================================================================
  /**
   * Membalikkan kondisi centangan barang (kalau tercentang jadi batal, kalau batal jadi tercentang).
   * Fitur ini murni dicatat di laci browser pelanggan (tidak mengganggu server).
   */
  const handleToggleSelect = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // =========================================================================
  // 7. TUGAS MENCATAT KETIKAN KODE VOUCHER (handleVoucherChange)
  // =========================================================================
  // Menyalin setiap huruf yang diketik pelanggan di kolom kupon diskon ke dalam laci voucherCode
  const handleVoucherChange = (e) => {
    setVoucherCode(e.target.value);
  };

  // =========================================================================
  // 8. TUGAS MEMERIKSA KEASLIAN VOUCHER KE SERVER (applyVoucher)
  // =========================================================================
  /**
   * Mengirim kurir untuk bertanya ke server: "Hei Server, kupon ini asli atau palsu?"
   */
  const applyVoucher = async (code) => {
    // Ambil kode dari parameter jika ada, atau ambil dari ketikan di laci voucherCode
    const kode = typeof code === 'string' ? code : voucherCode;
    if (!kode) return; // Jika kodenya kosong melompong, batalkan misi
    
    setVoucherError(''); // Bersihkan pesan error lama sebelum mulai memeriksa
    try {
      // Mengumpulkan ID barang-barang yang sedang DICENTANG saja untuk diperiksa apakah berhak dapat diskon
      const cart_ids = selectedItems.map(item => item.id);
      
      // Kurir mengetuk pintu pemeriksaan promo di server (metode POST)
      const res = await axiosClient.post(endpoints.customer.promoCheck, {
        kode,
        cart_ids
      });
      
      // Jika server menjawab "Kupon ini Asli dan Valid!"
      if (res.data.success) {
        setAppliedVoucher(res.data.data); // Pajang hadiah diskonnya di kotak kaca appliedVoucher
      } else {
        // Jika server menolak kuponnya
        setAppliedVoucher(null); // Kosongkan kotak kaca
        setVoucherError(res.data.message || 'Promo ditolak oleh sistem.'); // Pajang alasan penolakannya di kotak merah
      }
    } catch (error) {
      // Jika terjadi insiden besar saat memeriksa kupon (server gangguan atau salah alamat)
      console.error('Error Cek Promo:', error);
      let errMsg = 'Gagal mengecek promo.';
      
      if (error.response) {
        if (error.response.data?.message) {
          // Tangkap kalimat omelan resmi dari server
          errMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string' && error.response.data.includes('<html')) {
          // Jika server pingsan dan malah mengirimkan halaman web error HTML (bukan JSON)
          errMsg = `Sistem Backend Error (HTML Response ${error.response.status}). Cek Network tab.`;
        } else {
          // Omelan cadangan untuk kasus salah rute atau server meledak (Error 404 / 500)
          errMsg = `Error ${error.response.status}: Route mungkin tidak ditemukan atau terjadi kesalahan server.`;
        }
      }
      setVoucherError(errMsg); // Tampilkan omelan di kotak merah
      setAppliedVoucher(null); // Batalkan pemakaian kupon
    }
  };

  /**
   * Fungsi pesanan kasir (saat ini masih sekadar mencatat di konsol browser)
   */
  const handleCheckout = () => {
    console.log('Checkout with total:', totalAmount);
  };

  // =========================================================================
  // ASISTEN KASIR PERAPI ANGKA (formatRupiah)
  // =========================================================================
  /**
   * Mengubah angka biasa menjadi tulisan uang resmi Indonesia.
   * Contoh: Angka kaku '50000' disulap menjadi 'Rp 50.000'. Sangat cantik dan rapi!
   */
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // =========================================================================
  // 9. KALKULATOR PINTAR KELAS ATAS (useMemo)
  // =========================================================================
  /*
    Mengapa kita pakai `useMemo`? 
    Bayangkan `useMemo` sebagai "Kalkulator Pintar Kelas Atas". Dia tidak mau capek-capek 
    menghitung ulang hal yang sama jika isi keranjangnya tidak berubah. 
    Hasilnya: Baterai HP dan prosesor komputer pelanggan jadi super hemat dan anti lemot!
  */

  // Kalkulator 1: Menyortir dan memisahkan barang mana saja yang sedang DICENTANG (selected = true)
  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems]
  );

  // Kalkulator 2: Mengalikan Harga dengan Jumlah (Price x Quantity) khusus untuk barang yang dicentang saja, lalu dijumlahkan totalnya
  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  // Kalkulator 3: Menghitung total banyaknya fisik kotak barang di dalam keranjang (untuk dipajang sebagai angka di ikon keranjang pojok atas)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // =========================================================================
  // 10. MEMASUKKAN SEMUA PERBEKALAN KE DALAM SATU RANSEL UTAMA (Value)
  // =========================================================================
  // Semua laci catatan, fungsi kurir, dan asisten kasir kita masukkan ke dalam satu tas ransel besar bernama `value`
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
    // 11. MENYIARKAN ISI RANSEL KE SELURUH HALAMAN MENGGUNAKAN PEMANCAR
    // =========================================================================
    // Stasiun pemancar (Provider) menyebarkan ransel `value` ini ke seluruh halaman anak (children) di bawahnya
    <CartContext.Provider value={value}>
      {children}
      
      {/* ======================================================================
          LAYAR POP-UP NOTIFIKASI MELAYANG (GLOBAL MODAL TOAST)
          ======================================================================
          Ini adalah boks pop-up cantik yang akan muncul melayang di tengah layar 
          begitu saklar modalConfig.isOpen menyala (true). 
      */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 max-w-sm mx-4 transform transition-all animate-in zoom-in-95 duration-200">
            
            {/* Pemilihan Ikon: Jika jenisnya 'success', pasang ikon centang hijau. Jika tidak, pasang ikon silang merah */}
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
            
            {/* Kalimat Judul dan Isi Pesan */}
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
