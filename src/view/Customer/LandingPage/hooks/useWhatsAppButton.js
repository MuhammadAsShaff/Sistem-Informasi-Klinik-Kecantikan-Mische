import { useState, useEffect } from 'react';

/**
 * =========================================================================
 * MANDOR KOMUNIKASI WHATSAPP & LIFTER (useWhatsAppButton)
 * =========================================================================
 * Ibarat petugas operator lift dan telepon di pos satpam lobi:
 * 1. Menjaga mata pada langkah tamu. Jika tamu sudah turun jauh ke bawah (scroll > 300), petugas memunculkan tombol lift khusus untuk naik ke atas seketika.
 * 2. Memegang kabel saluran langsung ke pusat bantuan WhatsApp Mische, siap menghubungkan tamu dengan dokter kapan saja.
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
