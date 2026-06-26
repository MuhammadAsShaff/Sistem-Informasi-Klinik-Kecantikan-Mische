import { useState } from 'react';
import { useCart } from './useCart';

export const useDetailKeranjang = () => {
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

  return {
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
  };
};
