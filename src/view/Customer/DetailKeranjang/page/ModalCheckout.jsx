import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { STORAGE_BASE_URL, endpoints } from '@/core/api/endpoints';
import axiosClient from '@/core/api/axiosClient';

export default function ModalCheckout({ 
  isOpen, 
  onClose, 
  selectedItems, 
  totalAmount, 
  formatRupiah,
  appliedVoucher
}) {
  const [voucher, setVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleApplyVoucher = () => {
    if (!voucher) return;
    
    // In ModalCheckout, if appliedVoucher matches, we just use it.
    if (appliedVoucher && voucher.toUpperCase() === appliedVoucher.kode.toUpperCase()) {
      setDiscountAmount(appliedVoucher.diskon);
    } else {
      setDiscountAmount(0);
      alert('Voucher tidak valid atau hanya bisa dicek dari halaman keranjang.');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert('Harap lengkapi alamat pengiriman!');
      return;
    }

    if (!paymentMethod) {
      alert('Harap pilih metode pembayaran!');
      return;
    }

    setIsCheckingOut(true);
    try {
      const payload = {
        idAlamat: selectedAddressId,
        paymentMethod: paymentMethod,
        idPromo: appliedVoucher ? appliedVoucher.idPromo : null
        // Pengiriman dihandle oleh backend
      };

      const response = await axiosClient.post(endpoints.customer.checkout, payload);
      
      if (response.data?.status === 'success' && response.data?.data?.snap_token) {
        // Trigger Midtrans Snap
        window.snap.pay(response.data.data.snap_token, {
          onSuccess: function(){
            alert('Pembayaran berhasil!');
            onClose();
            window.location.reload();
          },
          onPending: function(){
            alert('Menunggu pembayaran!');
            onClose();
            window.location.reload();
          },
          onError: function(){
            alert('Pembayaran gagal!');
          },
          onClose: function(){
            alert('Anda menutup pop-up tanpa menyelesaikan pembayaran');
          }
        });
      } else {
        alert(response.data?.message || 'Gagal membuat pesanan.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan sistem saat checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const grandTotal = totalAmount - discountAmount;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#f8f9fa] w-full max-w-5xl rounded-3xl p-6 md:p-10 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:bg-gray-200 p-2 rounded-full transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Checkout Pesanan</h2>

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
                  : item.image ? `${STORAGE_BASE_URL}${item.image}` : '';
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
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5cb85c] focus:ring-1 focus:ring-[#5cb85c] bg-white text-gray-800"
                >
                  <option value="" disabled>Pilih Metode Pembayaran</option>
                  <option value="bca">BCA Virtual Account</option>
                  <option value="mandiri">Mandiri Virtual Account</option>
                  <option value="gopay">GoPay</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>

              {/* Total Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Total Harga ({selectedItems.length} Barang)</span>
                    <span>{formatRupiah(totalAmount)}</span>
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
  );
}
