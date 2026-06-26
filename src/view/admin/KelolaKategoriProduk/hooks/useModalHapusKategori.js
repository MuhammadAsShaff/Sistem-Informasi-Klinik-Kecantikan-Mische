import { useState } from 'react';
import { useHapusKategori } from './useHapusKategori';

export const useModalHapusKategori = (dataId, refetch, showToast, onClose) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { hapusKategori } = useHapusKategori(refetch);

  const handleDelete = async () => {
    if (!dataId) return;
    setIsDeleting(true);
    const result = await hapusKategori(dataId);
    setIsDeleting(false);

    if (result.success) {
      showToast("Berhasil menghapus kategori produk", 'success');
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
