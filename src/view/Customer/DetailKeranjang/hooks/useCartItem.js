import { useState } from 'react';

/**
 * =========================================================================
 * PETUGAS PENGATUR JUMLAH BARANG (useCartItem)
 * =========================================================================
 * Ibarat petugas loket di depan setiap barang dalam troli Anda:
 * 1. Jika Anda meminta tambah barang, petugas mencatat penambahannya.
 * 2. Jika Anda mengurangi barang padahal sisa 1, petugas akan menahan tangan Anda lalu membunyikan lonceng konfirmasi ("Benar mau dihapus dari troli?").
 */
export const useCartItem = (item, onQuantityChange, onRemove) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDecrease = () => {
    if (item.quantity === 1) {
      setIsDeleteModalOpen(true);
    } else {
      onQuantityChange(item.id, -1);
    }
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    if (onRemove) {
        onRemove(item.id);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDecrease,
    handleConfirmDelete
  };
};
