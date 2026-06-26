import { useState, useEffect } from 'react';
import { useTambahKategori } from './useTambahKategori';

export const useModalTambahKategori = (isOpen, refetch, showToast, onClose) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tambahKategori } = useTambahKategori(refetch);

  // Reset fields when opened
  useEffect(() => {
    if (isOpen) {
      setNama('');
      setDeskripsi('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!nama.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await tambahKategori({ nama, deskripsi });
    setIsSubmitting(false);

    if (result.success) {
      showToast("Berhasil menambahkan kategori produk", 'success');
      onClose();
    } else {
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error');
    }
  };

  return {
    nama,
    setNama,
    deskripsi,
    setDeskripsi,
    isSubmitting,
    handleSave
  };
};
