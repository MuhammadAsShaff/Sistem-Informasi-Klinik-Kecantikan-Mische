import { useState, useEffect } from 'react';

/**
 * =========================================================================
 * ASISTEN JAGA BILIK KONFIRMASI BOOKING (useModalDetailReservasi)
 * =========================================================================
 * Ibarat pendamping ramah yang membantu tamu memeriksa rincian pemesanan sebelum
 * ditandatangani. Ia juga bertugas menghitung bahwa sesi perawatan rata-rata
 * berlangsung tepat selama satu jam dari jadwal awal.
 */
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
