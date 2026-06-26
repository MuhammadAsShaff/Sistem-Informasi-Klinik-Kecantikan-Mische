import { useState, useEffect } from 'react';

/**
 * =========================================================================
 * CUSTOM HOOK: useWhatsAppButton
 * =========================================================================
 * Hook ini mengelola logika untuk tombol WhatsApp melayang (Floating Button)
 * dan tombol Scroll-to-Top:
 * 1. Mendeteksi perubahan scroll halaman untuk memunculkan tombol kembali ke atas.
 * 2. Mengarahkan pengguna ke link WhatsApp API dengan pesan template kustom.
 */
export function useWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "628984818977"; 
  const message = "Halo Mische Aesthetic Clinic, saya ingin bertanya tentang perawatan...";

  // Mendeteksi jarak scroll layar untuk menampilkan/menyembunyikan tombol scroll ke atas
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Menggulung halaman kembali secara halus ke posisi paling atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Membuka tautan direct chat WhatsApp di tab baru
  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return {
    isVisible,
    scrollToTop,
    openWhatsApp
  };
}
