import React from 'react';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import ModalCheckout from './ModalCheckout';
import CustomerLoading from '@/components/CustomerLoading';
import { useDetailKeranjang } from '../hooks/useDetailKeranjang';

/**
 * =========================================================================
 * KOMPONEN VIEW: DetailKeranjang (Halaman Keranjang & Checkout Customer)
 * =========================================================================
 * Komponen ini berfungsi merender daftar produk di dalam keranjang belanja
 * customer, ringkasan belanja, input kode kupon promo, dan mengarahkan ke modal checkout.
 * 
 * Seluruh status pemuatan data keranjang, ubah kuantitas produk, kalkulasi diskon,
 * hapus produk dari keranjang, dan interaksi server dikoordinasikan secara penuh
 * di hook `useDetailKeranjang`.
 */
const DetailKeranjang = () => {
  const {
    cartItems,
    selectedItems,
    totalAmount,
    voucherCode,
    handleQuantityChange,
    handleToggleSelect,
    removeFromCart,
    handleVoucherChange,
    applyVoucher,
    handleCheckout,
    formatRupiah,
    appliedVoucher,
    setAppliedVoucher,
    voucherError,
    isCartLoading,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
  } = useDetailKeranjang();

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header Title */}
        <CartHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Product List */}
          <div className="lg:col-span-2 space-y-4">
            {isCartLoading ? (
              <CustomerLoading text="Memuat keranjang belanjamu..." />
            ) : (
              <>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onToggleSelect={handleToggleSelect}
                    onRemove={removeFromCart}
                    formatRupiah={formatRupiah}
                  />
                ))}
                
                {cartItems.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">Keranjang belanjamu masih kosong.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1 sticky top-6">
            <OrderSummary
              selectedItems={selectedItems}
              totalAmount={totalAmount}
              voucherCode={voucherCode}
              onVoucherChange={handleVoucherChange}
              onApplyVoucher={applyVoucher}
              onRemoveVoucher={() => setAppliedVoucher(null)}
              onCheckout={() => setIsCheckoutModalOpen(true)}
              formatRupiah={formatRupiah}
              appliedVoucher={appliedVoucher}
              voucherError={voucherError}
            />
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      <ModalCheckout 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedItems={selectedItems}
        totalAmount={totalAmount}
        formatRupiah={formatRupiah}
        appliedVoucher={appliedVoucher}
      />
    </div>
  );
};

export default DetailKeranjang;
