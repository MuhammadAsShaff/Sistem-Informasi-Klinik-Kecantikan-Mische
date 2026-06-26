import { useState } from 'react';
import { useHapusTestimoni } from './useHapusTestimoni';

export const useModalHapus = (data, refetch, showToast, onClose) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { hapusTestimoni } = useHapusTestimoni(refetch);

  const handleDelete = async () => {
    if (!data) return;
    setIsDeleting(true);
    const result = await hapusTestimoni(data.id || data.idTestimoni);
    setIsDeleting(false);

    if (result.success) {
      showToast("Berhasil menghapus testimoni", "success");
      onClose();
    } else {
      showToast(result.message, "error");
    }
  };

  return {
    isDeleting,
    handleDelete
  };
};
