import { useState } from 'react';
import { useHapusProduk } from './useHapusProduk';

export const useModalHapusProduk = (dataId, refetch, showToast, onClose) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { hapusProduk } = useHapusProduk(refetch);

  const handleDelete = async () => {
    if (!dataId) return;
    setIsDeleting(true);
    const result = await hapusProduk(dataId);
    setIsDeleting(false);

    if (result.success) {
      showToast("Berhasil menghapus produk", 'success');
      onClose();
    } else {
      showToast(result.message, 'error');
    }
  };

  return {
    isDeleting,
    handleDelete
  };
};
