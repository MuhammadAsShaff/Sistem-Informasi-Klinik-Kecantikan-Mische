import { useState, useEffect } from 'react';

export const useModalResi = (data, onSave) => {
  const [nomorResi, setNomorResi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setNomorResi(data.nomorResi || '');
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(data.idPenjualan || data.id, nomorResi);
    setIsSubmitting(false);
  };

  return {
    nomorResi,
    setNomorResi,
    isSubmitting,
    handleSubmit
  };
};
