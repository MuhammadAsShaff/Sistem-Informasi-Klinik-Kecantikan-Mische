import React from "react";
import { X, Package, MapPin, Truck, CreditCard, ShoppingBagIcon } from "lucide-react";
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

export default function ModalDetailPembelian({ isOpen, onClose, selectedOrder }) {
  if (!isOpen || !selectedOrder) return null;

  const order = selectedOrder;

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('selesai') || s.includes('terima')) return 'bg-[#d1f4cc] text-[#2c7a20] border-[#2c7a20]/20';
    if (s.includes('kirim') || s.includes('perjalanan')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (s.includes('batal')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  const getPaymentStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'settlement' || s === 'capture') return 'text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs font-bold';
    if (s === 'pending') return 'text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold';
    return 'text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-bold';
  };

  const formatPaymentType = (type) => {
    if (!type) return 'Belum Melakukan Pembayaran';
    const s = String(type).toLowerCase();
    if (s === 'bank_transfer') return 'Transfer Bank';
    if (s === 'echannel') return 'Mandiri Bill';
    if (s === 'gopay') return 'GoPay';
    if (s === 'qris') return 'QRIS';
    if (s === 'shopeepay') return 'ShopeePay';
    if (s === 'cstore') return 'Indomaret / Alfamart';
    if (s === 'credit_card') return 'Kartu Kredit / Debit';
    return type;
  };

  const items = order.detailPenjualan || order.items || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden font-poppins max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFB] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Pembelian</h2>
            <p className="text-sm text-gray-500 mt-1">Invoice: {order.invoiceNumber || `TRX-${order.idPenjualan}`}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status Pengiriman</p>
              <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus || order.status)}`}>
                {order.orderStatus || order.status || 'Menunggu'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Tanggal Transaksi</p>
              <p className="font-bold text-sm text-gray-800">{order.tanggal || order.created_at}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
               <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                 <CreditCard size={18} className="text-[#56BC36]" />
                 Informasi Pembayaran
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Status</span>
                 <span className={getPaymentStatusColor(order.paymentStatus || order.status_pembayaran)}>{(order.paymentStatus || order.status_pembayaran || 'Unpaid').toUpperCase()}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Metode</span>
                 <span className="font-semibold text-gray-800">{formatPaymentType(order.payment_type || order.paymentMethod)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Total Harga</span>
                 <span className="font-bold text-[#56BC36]">{formatRupiah(order.total || 0)}</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
               <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                 <Truck size={18} className="text-[#56BC36]" />
                 Informasi Pengiriman
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Kurir</span>
                 <span className="font-semibold text-gray-800 uppercase">{order.shippingCourier ? `${order.shippingCourier} (${order.shippingService || ''})` : '-'}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">No. Resi</span>
                 <span className="font-semibold text-gray-800">{order.resi || order.nomorResi || 'Belum tersedia'}</span>
               </div>
               <div className="mt-2 text-xs text-gray-500">
                 <div className="flex items-start gap-1">
                   <MapPin size={14} className="mt-0.5 shrink-0" />
                   <span>
                     {order.alamat ? (
                       <>
                         <div className="font-semibold">{order.alamat.namaPenerima} ({order.alamat.nomorHp})</div>
                         <div>{order.alamat.detailAlamat}, {order.alamat.districtId ? `${order.alamat.districtId}, ` : ''}{order.alamat.cityId}, {order.alamat.provinceId} {order.alamat.kodePos}</div>
                       </>
                     ) : (
                       order.alamatCustomer?.detailAlamat || order.alamatPengiriman || 'Alamat tidak ditemukan'
                     )}
                   </span>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                <Package size={18} className="text-[#56BC36]" />
                Rincian Produk
             </div>
             <div className="space-y-4">
               {items.map((item, idx) => {
                 const imageSrc = item.produk?.gambar?.startsWith?.('http') || item.produk?.gambar?.startsWith?.('data:') 
                   ? item.produk?.gambar 
                   : item.produk?.gambar ? `${STORAGE_BASE_URL}${String(item.produk?.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}` : '';
                 
                 return (
                   <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                        {imageSrc ? <img src={imageSrc} className="w-full h-full object-cover rounded-md" /> : <Package size={24} className="text-gray-300" />}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.produk?.nama || item.nama}</h4>
                         <p className="text-xs text-gray-500 mt-1">{item.jumlahProduk || item.quantity || 1} x {formatRupiah(item.produk?.harga || item.harga || 0)}</p>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                         <span className="text-sm font-bold text-gray-800">
                           {formatRupiah((item.jumlahProduk || item.quantity || 1) * (item.produk?.harga || item.harga || 0))}
                         </span>
                      </div>
                   </div>
                 )
               })}
             </div>
             
             {/* Rincian Total */}
             <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal Produk</span>
                  <span>{formatRupiah(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span>{order.shippingCost ? formatRupiah(order.shippingCost) : formatRupiah(0)}</span>
                </div>
                {order.promo && (
                  <div className="flex justify-between text-sm text-green-500 font-medium">
                    <span>Diskon Promo ({order.promo.kode || order.promo.namaPromo})</span>
                    <span>-{formatRupiah((order.subtotal || 0) + (order.shippingCost || 0) - (order.total || 0))}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t border-gray-50 mt-2">
                  <span>Total Akhir</span>
                  <span className="text-[#56BC36]">{formatRupiah(order.total || 0)}</span>
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white shrink-0 flex justify-end">
           <button onClick={onClose} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition shadow-sm">
             Tutup
           </button>
        </div>

      </div>
    </div>
  );
}
