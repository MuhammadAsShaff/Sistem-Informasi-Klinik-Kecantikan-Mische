import { useState, useEffect } from 'react';
import { useEditEvent } from './useEditEvent';
import { convertToJPEG } from '@/utils/imageConverter';

export const useModalPerbaruiEvent = (event, refetch, showToast, onClose) => {
  const { editEvent } = useEditEvent(refetch);
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deskripsi: '',
    foto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        nama: event.nama || '',
        lokasi: event.lokasi || '',
        tanggalMulai: event.tanggalMulai ? event.tanggalMulai.split(' ')[0] : '', 
        tanggalSelesai: event.tanggalSelesai ? event.tanggalSelesai.split(' ')[0] : '',
        deskripsi: event.deskripsi || '',
        foto: null
      });
    }
  }, [event]);

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
    if (!event) return;
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('nama', formData.nama);
    payload.append('lokasi', formData.lokasi);
    payload.append('tanggalMulai', formData.tanggalMulai);
    payload.append('tanggalSelesai', formData.tanggalSelesai);
    payload.append('deskripsi', formData.deskripsi);
    if (formData.fotoBaru) {
      payload.append('foto', formData.fotoBaru);
    } else if (formData.foto) {
      payload.append('foto', formData.foto);
    }
    
    const result = await editEvent(event.id || event.idEvent, payload);
    setIsSubmitting(false);
    
    if (result.success) {
      showToast("Berhasil memperbarui event");
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
