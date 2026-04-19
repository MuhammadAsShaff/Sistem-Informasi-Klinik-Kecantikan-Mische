import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronUp } from 'lucide-react';

const FloatingCta = () => {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "6282187650987";
  const message = "Halo Mische Aesthetic Clinic, saya ingin bertanya tentang perawatan...";

  // Logika untuk menampilkan/menyembunyikan tombol Scroll to Top
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* 1. TOMBOL SCROLL TO TOP (HANYA MUNCUL SAAT DI SCROLL KE BAWAH) */}
      <button
        onClick={scrollToTop}
        className={`pointer-events-auto flex items-center justify-center bg-white border-2 border-[#56BC36] text-[#56BC36] rounded-xl transition-all duration-300 shadow-lg hover:bg-[#56BC36] hover:text-white group
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          w-12 h-12 md:w-14 md:h-14
        `}
        aria-label="Back to top"
      >
        <ChevronUp className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
      </button>

      {/* 2. TOMBOL WHATSAPP (SESUAI GAMBAR: PERSEGI PANJANG DENGAN TEKS) */}
      <button
        onClick={openWhatsApp}
        className="pointer-events-auto flex items-center gap-3 bg-[#56BC36] hover:bg-[#45a42b] text-white px-5 py-3 md:px-7 md:py-4 rounded-xl shadow-[0_10px_25px_rgba(86,188,54,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group"
      >
        <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
          <MessageSquare className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" />
        </div>
        <span className="text-base md:text-xl font-bold tracking-wide">WhatsApp</span>
      </button>

    </div>
  );
};

export default FloatingCta;
