import { useState } from 'react';

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
