import React, { useState } from 'react';
import { useCart } from './hooks/useCart';
import CartHeader from './page/CartHeader';
import CartItem from './page/CartItem';
import OrderSummary from './page/OrderSummary';
import ModalCheckout from './page/ModalCheckout';
import CustomerLoading from '../components/CustomerLoading';

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
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
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
