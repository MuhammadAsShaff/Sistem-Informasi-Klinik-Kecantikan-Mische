import React from 'react';

const OrderSummary = ({
  selectedItems,
  totalAmount,
  voucherCode,
  onVoucherChange,
  onApplyVoucher,
  onCheckout,
  formatRupiah,
  appliedVoucher,
  voucherError,
}) => {
  const finalTotal = appliedVoucher ? totalAmount - appliedVoucher.diskon : totalAmount;
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Total Dari Pembelian
      </h2>

      <p className="text-gray-800 text-lg mb-4">Total Dari Pembelian</p>

      {/* List of Selected Items */}
      <div className="space-y-4 mb-6">
        {selectedItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">{item.name}</span>
            <span className="text-[#56BC36] font-semibold">
              {formatRupiah(item.price * item.quantity)}
            </span>
          </div>
        ))}
        {selectedItems.length === 0 && (
          <p className="text-sm text-gray-400 italic">Belum ada produk dipilih</p>
        )}
      </div>

      <hr className="border-t-2 border-gray-800 mb-6" />

      {/* Grand Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-800 font-medium w-1/2">Total Pembelian</span>
        <div className="flex flex-col items-end">
          {appliedVoucher && (
            <span className="text-gray-400 line-through text-sm">
              {formatRupiah(totalAmount)}
            </span>
          )}
          <span className="text-[#56BC36] font-bold text-xl">
            {formatRupiah(finalTotal > 0 ? finalTotal : 0)}
          </span>
        </div>
      </div>

      {/* Voucher Input */}
      <div className="flex flex-col mb-6">
        <div className="flex gap-0">
          <input
            type="text"
            placeholder="Masukkan Voucher"
            value={voucherCode}
            onChange={onVoucherChange}
            disabled={!!appliedVoucher || selectedItems.length === 0}
            className={`flex-1 border border-gray-300 rounded-l-full px-4 py-2 text-sm focus:outline-none ${appliedVoucher || selectedItems.length === 0 ? 'bg-gray-100 text-gray-500' : 'focus:ring-1 focus:ring-[#5cb85c] focus:border-[#5cb85c]'} placeholder-gray-400`}
          />
          <button
            onClick={onApplyVoucher}
            disabled={!!appliedVoucher || selectedItems.length === 0}
            className={`px-6 py-2 rounded-r-full transition-colors text-sm font-bold text-white ${appliedVoucher || selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56BC36] hover:bg-[#2da509]'}`}
          >
            Pakai
          </button>
        </div>
        {voucherError && (
          <p className="text-red-500 text-xs mt-2 text-left">{voucherError}</p>
        )}
        {appliedVoucher && (
          <p className="text-[#56BC36] text-xs mt-2 text-left font-medium">Promo berhasil digunakan: {appliedVoucher.namaPromo}</p>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={selectedItems.length === 0}
        className="w-full bg-[#56BC36] hover:bg-[#2da509] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition-colors text-lg"
      >
        Bayar
      </button>
    </div>
  );
};

export default OrderSummary;
