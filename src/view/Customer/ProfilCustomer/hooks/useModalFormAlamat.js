import { useState, useEffect } from 'react';

export const useModalFormAlamat = (isOpen, onClose, onSave, fetchCities) => {
  const [formData, setFormData] = useState({
    namaPenerima: '',
    nomorHp: '',
    provinceId: '',
    cityId: '',
    kecamatan: '',
    kodePos: '',
    detailAlamat: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        namaPenerima: '',
        nomorHp: '',
        provinceId: '',
        cityId: '',
        kecamatan: '',
        kodePos: '',
        detailAlamat: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorHp') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\\D/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'provinceId') {
      setFormData(prev => ({ ...prev, cityId: '' }));
      if (fetchCities) fetchCities(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaPenerima || !formData.nomorHp || !formData.provinceId || !formData.cityId || !formData.kecamatan || !formData.kodePos || !formData.detailAlamat) {
      setToast({ isOpen: true, message: "Harap lengkapi semua field bertanda *", type: "warning" });
      return;
    }

    setIsSubmitting(true);
    const success = await onSave(formData);
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  const closeToast = () => setToast({ ...toast, isOpen: false });

  return {
    formData,
    isSubmitting,
    toast,
    closeToast,
    handleChange,
    handleSubmit
  };
};
