import { useCartContext } from '@/core/context/CartContext';

/**
 * =========================================================================
 * ASISTEN PENGHUBUNG KANTONG BELANJA (useCart)
 * =========================================================================
 * Ibarat pesuruh cepat yang siap sedia berlari ke gudang pusat keranjang (CartContext).
 * Jika ada meja atau bilik yang ingin menanyakan jumlah barang di keranjang, asisten ini langsung menyodorkan catatannya.
 */
export const useCart = () => {
  return useCartContext();
};
