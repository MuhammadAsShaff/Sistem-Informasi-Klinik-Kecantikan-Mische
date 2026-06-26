import { useState, useEffect } from 'react';
import { useEditKategori } from './useEditKategori';

export const useModalPerbaruiKategori = (categoryData, isOpen, refetch, showToast, onClose) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { editKategori } = useEditKategori(refetch);

  useEffect(() => {
    if (categoryData) {
      setNama(categoryData.nama || categoryData.name || '');
      setDeskripsi(categoryData.deskripsi || categoryData.description || '');
    } else {
      setNama('');
      setDeskripsi('');
    }
  }, [categoryData, isOpen]);

  const handleSave = async () => {
    if (categoryData) {
      if (!nama.trim()) {
        showToast('Nama kategori wajib diisi', 'error');
        return;
      }
      setIsSubmitting(true);
      const result = await editKategori(categoryData.idKategori || categoryData.id, { nama, deskripsi });
      setIsSubmitting(false);

      if (result.success) {
        showToast("Berhasil memperbarui kategori produk", 'success');
        onClose();
      } else {
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
        }
        showToast(errorDetail, 'error');
      }
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
