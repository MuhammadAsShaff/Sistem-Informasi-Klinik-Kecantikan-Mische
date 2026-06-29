import React from 'react';
import { X, MapPin, Loader2, Truck } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import { useCartContext } from '@/core/context/CartContext';
import { useCheckout } from '../hooks/useCheckout';

// Import Payment Method Images
import imgBCA from '@/assets/images/MetodePembayaran/BCA.png';
import imgBNI from '@/assets/images/MetodePembayaran/BNI.png';
import imgBRI from '@/assets/images/MetodePembayaran/BRI.png';
import imgMandiri from '@/assets/images/MetodePembayaran/MANDIRI.png';
import imgPermata from '@/assets/images/MetodePembayaran/PERMATA.png';
import imgGoPay from '@/assets/images/MetodePembayaran/GOPAY.png';
import imgShopeePay from '@/assets/images/MetodePembayaran/SHOPEEPAY.png';
import imgIndomaret from '@/assets/images/MetodePembayaran/INDOMARET.png';
import imgAlfamart from '@/assets/images/MetodePembayaran/ALFAMART.png';

/**
 * =========================================================================
 * BALAI PEMBAYARAN KASIR PRIVAT (ModalCheckout)
 * =========================================================================
 * Ibarat ruang VIP kasir yang tertutup tirai gelap agar tamu fokus berbelanja.
 * Di sini, tamu dipersilakan meninjau rak alamat pengiriman, memilih kurir
 * (RajaOngkir), dan menunjuk lambang bank favorit. Seluruh lalu lintas uang
 * dan data dikawal ekstra ketat oleh Mandor Kepala Loket (useCheckout).
 */
export default function ModalCheckout({ 
  isOpen, 
  onClose, 
  selectedItems, 
  totalAmount, 
  formatRupiah,
  appliedVoucher
}) {
  const { fetchCart } = useCartContext();

  // Memakai custom hook useCheckout untuk memisahkan seluruh logika bisnis dari visual JSX
  const {
    discountAmount,
    paymentMethod, setPaymentMethod,               // Pilihan metode bayar
    addresses,                                      // Array daftar alamat
    selectedAddressId, setSelectedAddressId,       // Alamat terpilih
    isDropdownOpen, setIsDropdownOpen,             // Dropdown toggle
    toast, setToast,                                // Umpan balik notifikasi
    shippingCosts,                                  // Tarif kurir dari RajaOngkir
    isLoadingShipping,                              // Status loading hitung tarif
    selectedShipping, setSelectedShipping,          // Tarif kurir terpilih
    isCheckingOut,                                  // Status loading submit pesanan
    handleCheckout,                                 // Trigger submit & pay
    grandTotal,                                     // Total harga akhir
    selectedAddress                                 // Objek alamat pengiriman aktif
  } = useCheckout({
    isOpen,
    onClose,
    selectedItems,
    totalAmount,
    appliedVoucher,
    fetchCart
  });

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
            
            {/* Left Column: Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Metode Pembayaran</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { id: 'bca_va', name: 'BCA VA', logo: imgBCA },
                  { id: 'bni_va', name: 'BNI VA', logo: imgBNI },
                  { id: 'bri_va', name: 'BRI VA', logo: imgBRI },
                  { id: 'permata_va', name: 'Permata VA', logo: imgPermata },
                  { id: 'gopay', name: 'GoPay', logo: imgGoPay },
                  { id: 'shopeepay', name: 'ShopeePay', logo: imgShopeePay },
                  { id: 'indomaret', name: 'Indomaret', logo: imgIndomaret },
                  { id: 'alfamart', name: 'Alfamart', logo: imgAlfamart },
                ].map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === method.id ? 'border-[#56BC36] bg-green-50 shadow-sm' : 'border-gray-200 hover:border-[#56BC36] hover:bg-green-50/30'}`}
                  >
                    <div className="h-8 w-full flex items-center justify-center rounded px-1">
                      <img 
                        src={method.logo} 
                        alt={method.name} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="max-h-full max-w-full object-contain mix-blend-multiply" 
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Total Summary */}
            <div className="space-y-6">

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
