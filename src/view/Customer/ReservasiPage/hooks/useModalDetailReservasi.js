import { useState, useEffect } from 'react';

export const useModalDetailReservasi = (isOpen) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Reset state pop-up saat modal utama ditutup
  useEffect(() => {
    if (!isOpen) {
      setIsConfirmOpen(false);
    }
  }, [isOpen]);

  // Asumsi jam selesai adalah 1 jam setelah jam mulai (karena formatnya jam pas seperti "07:00")
  const calculateJamSelesai = (jamMulai) => {
    if (!jamMulai) return "";
    const [jam] = jamMulai.split(':');
    const jamBerikutnya = parseInt(jam) + 1;
    return `${String(jamBerikutnya).padStart(2, '0')}:00`;
  };

  return {
    isConfirmOpen,
    setIsConfirmOpen,
    calculateJamSelesai
  };
};
