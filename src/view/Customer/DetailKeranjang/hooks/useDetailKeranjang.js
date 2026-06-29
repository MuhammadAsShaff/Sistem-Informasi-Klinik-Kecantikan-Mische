import { useState } from 'react';
import { useCart } from './useCart';

/**
 * =========================================================================
 * MANDOR KORDINATOR TROLI BELANJA (useDetailKeranjang)
 * =========================================================================
 * Ibarat mandor pengawas di pos pemeriksaan troli. Mandor ini mengumpulkan
 * seluruh catatan barang dari Asisten Penghubung (useCart), memegang stempel
 * kupon diskon, serta memegang kunci gembok untuk membuka Gerbang Loket Kasir (Modal Checkout).
 */
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
