import { useState } from 'react';
import { useTambahEvent } from './useTambahEvent';
import { convertToJPEG } from '@/utils/imageConverter';

export const useModalTambahEvent = (refetch, showToast, onClose) => {
  const { tambahEvent } = useTambahEvent(refetch);
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deskripsi: '',
    foto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const converted = await convertToJPEG(file);
        setFormData(prev => ({ ...prev, [name]: converted }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('nama', formData.nama);
    payload.append('lokasi', formData.lokasi);
    payload.append('tanggalMulai', formData.tanggalMulai);
    payload.append('tanggalSelesai', formData.tanggalSelesai);
    payload.append('deskripsi', formData.deskripsi);
    if (formData.foto) {
      payload.append('foto', formData.foto);
    }
    
    const result = await tambahEvent(payload);
    setIsSubmitting(false);
    
    if (result.success) {
      showToast("Berhasil menambahkan event");
      setFormData({ nama: '', lokasi: '', tanggalMulai: '', tanggalSelesai: '', deskripsi: '', foto: null });
      onClose();
    } else {
      showToast(result.message, "error");
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
