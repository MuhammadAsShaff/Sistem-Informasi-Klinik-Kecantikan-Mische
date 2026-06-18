import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader2, Truck } from 'lucide-react';
import { STORAGE_BASE_URL, endpoints } from '@/core/api/endpoints';
import axiosClient from '@/core/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '@/view/components/ToastAlert';

export default function ModalCheckout({ 
  isOpen, 
  onClose, 
  selectedItems, 
  totalAmount, 
  formatRupiah,
  appliedVoucher
}) {
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const [shippingCosts, setShippingCosts] = useState([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingCache, setShippingCache] = useState({});
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch addresses and reset state
  useEffect(() => {
    if (isOpen) {
      if (appliedVoucher) {
        setVoucher(appliedVoucher.kode);
        setDiscountAmount(appliedVoucher.diskon);
      } else {
        setVoucher('');
        setDiscountAmount(0);
      }
      setPaymentMethod('');
      fetchAddresses();
    }
  }, [isOpen, appliedVoucher]);

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

  useEffect(() => {
    if (isOpen && selectedAddressId) {
      fetchShippingCosts(selectedAddressId);
    }
  }, [isOpen, selectedAddressId]);

  const fetchShippingCosts = async (alamatId) => {
    // Retrieve cart IDs from selected items to send to the backend
    const cartIds = selectedItems.map(item => item.idKeranjang || item.id);
    const cartIdsString = [...cartIds].sort().join(',');
    const cacheKey = `ongkir_${alamatId}_${cartIdsString}`;

    // 1. Cek State Cache
    if (shippingCache[cacheKey]) {
      setShippingCosts(shippingCache[cacheKey]);
      setSelectedShipping(null);
      return;
    }

    // 2. Cek Session Storage Cache (persisten selama browser terbuka)
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

  const handleApplyVoucher = () => {
    if (!voucher) return;
    
    // In ModalCheckout, if appliedVoucher matches, we just use it.
    if (appliedVoucher && voucher.toUpperCase() === appliedVoucher.kode.toUpperCase()) {
      setDiscountAmount(appliedVoucher.diskon);
    } else {
      setDiscountAmount(0);
      setToast({ isOpen: true, message: 'Voucher tidak valid atau hanya bisa dicek dari halaman keranjang.', type: 'error' });
    }
  };

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
        idAlamat: selectedAddressId,
        paymentMethod: paymentMethod,
        idPromo: appliedVoucher ? appliedVoucher.idPromo : null,
        shipping: selectedShipping
      };

      // MATIKAN HIT API SEMENTARA UNTUK MELIHAT CONTOH MODAL
      // const response = await axiosClient.post(endpoints.customer.checkout, payload);
      const response = {
        data: {
          status: 'success',
          data: {
            snap_token: 'dummy-token-12345' // Token sembarang agar window.snap.pay terpanggil
          }
        }
      };
      
      if (response.data?.status === 'success' && response.data?.data?.snap_token) {
        // Trigger Midtrans Snap
        window.snap.pay(response.data.data.snap_token, {
          onSuccess: function(){
            setToast({ isOpen: true, message: 'Pembayaran berhasil!', type: 'success' });
            setTimeout(() => {
              onClose();
              navigate('/ProfilCustomer/riwayat-pembelian');
            }, 1000);
          },
          onPending: function(){
            setToast({ isOpen: true, message: 'Menunggu pembayaran!', type: 'warning' });
            setTimeout(() => {
              onClose();
              navigate('/ProfilCustomer/riwayat-pembelian');
            }, 1000);
          },
          onError: function(){
            setToast({ isOpen: true, message: 'Pembayaran gagal!', type: 'error' });
            setTimeout(() => {
              onClose();
              navigate('/ProfilCustomer/riwayat-pembelian');
            }, 1000);
          },
          onClose: function(){
            setToast({ isOpen: true, message: 'Anda menutup pop-up tanpa menyelesaikan pembayaran', type: 'warning' });
            setTimeout(() => {
              onClose();
              navigate('/ProfilCustomer/riwayat-pembelian');
            }, 1000);
          }
        });
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

  const grandTotal = totalAmount - discountAmount + (selectedShipping?.value || 0);
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-[#f8f9fa] w-full max-w-5xl rounded-3xl shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-[#f8f9fa] px-6 py-6 md:px-10 border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex-1"></div>
          <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">Checkout Pesanan</h2>
          <div className="flex-1 flex justify-end">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
          
          {/* Section 1: Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 p-2 rounded-full text-[#56BC36] shrink-0">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Alamat Pengiriman</h3>
            </div>

            {addresses.length > 0 ? (
              <>
                <div 
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#56BC36] transition flex justify-between items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedAddress ? (
                    <div>
                      <p className="text-gray-800 font-bold mb-1">{selectedAddress.namaPenerima} | {selectedAddress.nomorHp}</p>
                      <p className="text-gray-500 text-sm">{selectedAddress.detailAlamat}, {selectedAddress.districtId ? `${selectedAddress.districtId}, ` : ''}{selectedAddress.cityId}, {selectedAddress.provinceId} {selectedAddress.kodePos}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Pilih Alamat Pengiriman</p>
                  )}
                  <span className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {addresses.map((alamat) => (
                      <div 
                        key={alamat.id}
                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${selectedAddressId === alamat.id ? 'bg-green-50' : ''}`}
                        onClick={() => {
                          setSelectedAddressId(alamat.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <p className="text-gray-800 font-bold mb-1">{alamat.namaPenerima} | {alamat.nomorHp}</p>
                        <p className="text-gray-500 text-sm">{alamat.detailAlamat}, {alamat.districtId ? `${alamat.districtId}, ` : ''}{alamat.cityId}, {alamat.provinceId} {alamat.kodePos}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 text-center">
                Belum ada alamat terdaftar. Silakan tambah alamat Anda terlebih dahulu.
              </div>
            )}
          </div>

          {/* Section 2: Product List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Produk Dibeli</h3>
            <div className="space-y-4">
              {selectedItems.map((item) => {
                const imageSrc = item.image?.startsWith?.('http') || item.image?.startsWith?.('data:') 
                  ? item.image 
                  : item.image ? `${STORAGE_BASE_URL}${String(item.image).replace(/^(?:public\/|storage\/|\/)+/, '')}` : '';
                return (
                  <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                      {imageSrc ? (
                        <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Img</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-gray-500 text-sm">{formatRupiah(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatRupiah(item.price * item.quantity)}</p>
                      <p className="text-gray-500 text-sm">x {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2.5: Pengiriman (RajaOngkir) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                <Truck size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Metode Pengiriman</h3>
            </div>
            
            {isLoadingShipping ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="animate-spin mr-3 text-blue-500" size={28} />
                <span className="font-medium">Mengecek ongkos kirim...</span>
              </div>
            ) : shippingCosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {shippingCosts.map((courier) => (
                  <div key={courier.code} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full bg-white shadow-sm">
                    <div className="bg-gray-50/80 p-3 border-b border-gray-200 flex items-center justify-between">
                       <span className="font-bold text-gray-800 uppercase tracking-wider text-sm flex items-center gap-2">
                         {courier.name}
                       </span>
                    </div>
                    <div className="p-2 flex-1 flex flex-col gap-2">
                      {courier.costs.map((cost, idx) => {
                        const isSelected = selectedShipping?.code === courier.code && selectedShipping?.service === cost.service;
                        return (
                          <div 
                            key={`${courier.code}-${idx}`} 
                            onClick={() => setSelectedShipping({ 
                              code: courier.code, 
                              name: courier.name,
                              service: cost.service, 
                              description: cost.description, 
                              value: cost.cost[0].value, 
                              etd: cost.cost[0].etd 
                            })}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${isSelected ? 'border-[#56BC36] bg-green-50 shadow-sm' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}
                          >
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-bold text-gray-800">{cost.service}</span>
                                <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200 font-medium truncate max-w-[120px]" title={cost.description}>{cost.description}</span>
                              </div>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                Estimasi: <span className="font-semibold text-gray-700">{cost.cost[0].etd ? `${cost.cost[0].etd} hari` : 'Sesuai layanan'}</span>
                              </p>
                            </div>
                            <div className="font-bold text-[#56BC36] whitespace-nowrap pl-2">
                              {formatRupiah(cost.cost[0].value)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 text-center flex flex-col items-center">
                 <span className="text-xl mb-2">⚠️</span>
                 <p className="font-medium">Opsi pengiriman tidak tersedia.</p>
                 <p className="text-sm mt-1 opacity-80">Pastikan alamat pengiriman Anda sudah lengkap dan benar.</p>
              </div>
            )}
          </div>

          {/* Section 3: Split Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: Voucher */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Voucher Mische</h3>
              <p className="text-sm text-gray-500 mb-4">Masukkan kode voucher untuk mendapatkan diskon.</p>
              <div className="flex gap-0">
                <input
                  type="text"
                  placeholder="Kode Voucher"
                  value={voucher}
                  readOnly={!!appliedVoucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  className={`flex-1 border border-gray-300 rounded-l-xl px-4 py-3 text-sm focus:outline-none ${appliedVoucher ? 'bg-gray-100 text-gray-500' : 'focus:border-[#5cb85c]'}`}
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={!!appliedVoucher}
                  className={`px-6 py-3 rounded-r-xl transition-colors text-sm font-bold text-white ${appliedVoucher ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56BC36] hover:bg-[#2da509]'}`}
                >
                  Pakai
                </button>
              </div>
              {discountAmount > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-[#56BC36] text-sm font-bold">✅ Promo berhasil diterapkan!</p>
                  <p className="text-green-700 text-xs mt-1">Anda menghemat {formatRupiah(discountAmount)}</p>
                </div>
              )}
            </div>

            {/* Right Column: Payment, Total */}
            <div className="space-y-6">
              
              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Metode Pembayaran</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bca', name: 'BCA VA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
                    { id: 'mandiri', name: 'Mandiri VA', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bank_Mandiri_logo_2016.svg' },
                    { id: 'gopay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
                    { id: 'qris', name: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' },
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === method.id ? 'border-[#56BC36] bg-green-50 shadow-sm' : 'border-gray-200 hover:border-[#56BC36] hover:bg-green-50/30'}`}
                    >
                      <div className="h-8 w-full flex items-center justify-center rounded px-1">
                        <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 text-center">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Total Harga ({selectedItems.length} Barang)</span>
                    <span>{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Ongkos Kirim</span>
                    <span>{selectedShipping ? formatRupiah(selectedShipping.value) : formatRupiah(0)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#56BC36] font-medium">
                      <span>Total Diskon Promo</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                </div>
                
                <hr className="border-t-2 border-gray-100 mb-6" />
                
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-800 font-bold text-lg">Total Tagihan</span>
                  <div className="text-right">
                    {discountAmount > 0 && (
                      <p className="text-gray-400 line-through text-sm mb-1">{formatRupiah(totalAmount)}</p>
                    )}
                    <p className="text-[#56BC36] font-bold text-2xl">
                      {formatRupiah(grandTotal)}
                    </p>
                  </div>
                </div>

                <button 
                  disabled={!paymentMethod || isCheckingOut}
                  className="w-full bg-[#56BC36] hover:bg-[#2da509] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? 'Memproses...' : 'Buat Pesanan'}
                </button>
              </div>

            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <ToastAlert 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </>
  );
}
