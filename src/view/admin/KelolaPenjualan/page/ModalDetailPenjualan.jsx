import React from 'react';
import { X } from 'lucide-react';

const ModalDetailPenjualan = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const getProdukNames = (detailpenjualan) => {
    if (!detailpenjualan || detailpenjualan.length === 0) return '-';
    return detailpenjualan.map(d => d.produk?.namaProduk || d.produk?.nama).join(', ');
  };

  const getJumlahTotal = (detailpenjualan) => {
    if (!detailpenjualan || detailpenjualan.length === 0) return 0;
    return detailpenjualan.reduce((acc, curr) => acc + curr.jumlahProduk, 0);
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden font-sans">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Detail Penjualan</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Info Utama */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">No. Invoice</label>
              <div className="text-gray-800 font-medium">{data.invoiceNumber || '-'}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal</label>
              <div className="text-gray-800 font-medium">{data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : '-'}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Customer</label>
              <div className="text-gray-800 font-medium">{data.user?.nama || 'Unknown'}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Order</label>
              <div className="text-gray-800 font-medium capitalize">{data.orderStatus || '-'}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Pembayaran</label>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                (() => {
                  const s = (data.paymentStatus || '').toLowerCase();
                  if (s === 'paid' || s === 'settlement' || s === 'capture') return 'bg-green-50 text-green-700 border-green-200';
                  if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  return 'bg-red-50 text-red-700 border-red-200';
                })()
              }`}>
                {(data.paymentStatus || 'UNPAID').toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Metode Pembayaran</label>
              <div className="text-gray-800 font-medium">{formatPaymentType(data.payment_type || data.paymentMethod)}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Resi</label>
              <div className="text-gray-800 font-medium">{data.nomorResi || '-'}</div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Pengiriman & Promo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pengiriman</label>
              <div className="text-gray-800 font-medium">
                {data.shippingCourier ? `${data.shippingCourier.toUpperCase()} (${data.shippingService})` : '-'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Promo Digunakan</label>
              <div className="text-gray-800 font-medium">
                {data.promo ? `${data.promo.namaPromo} (${data.promo.kode})` : '-'}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Produk List */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Daftar Produk ({getJumlahTotal(data.detailpenjualan)} Item)</label>
            <div className="space-y-3">
              {data.detailpenjualan && data.detailpenjualan.length > 0 ? (
                data.detailpenjualan.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <div className="font-medium text-gray-800">
                      {detail.produk?.namaProduk || detail.produk?.nama || 'Unknown'} 
                      <span className="text-gray-500 ml-2">x{detail.jumlahProduk}</span>
                    </div>
                    <div className="text-gray-600">
                      Rp {((detail.produk?.harga || 0) * detail.jumlahProduk).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">-</div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Ringkasan Biaya */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rp {data.subtotal ? data.subtotal.toLocaleString('id-ID') : 0}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Biaya Pengiriman</span>
              <span>Rp {data.shippingCost ? data.shippingCost.toLocaleString('id-ID') : 0}</span>
            </div>
            {data.promo && (
              <div className="flex justify-between text-green-600">
                <span>Diskon Promo</span>
                <span>- Rp {(data.subtotal + data.shippingCost - data.total).toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
              <span>Total Akhir</span>
              <span className="text-green-600">Rp {data.total ? data.total.toLocaleString('id-ID') : 0}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailPenjualan;
