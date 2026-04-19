import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "6282187650987"; // Ganti dengan nomor asli klinik
  const message = "Halo Mische Aesthetic Clinic, saya ingin bertanya tentang perawatan...";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center"
      aria-label="Chat WhatsApp"
    >
      {/* Efek Ping (Gelombang) sesuai pola warna project */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#56BC36] opacity-75 animate-ping"></span>
      
      {/* Tombol Utama (Warna Mische Clinic) */}
      <div className="relative bg-[#56BC36] hover:bg-[#45a42b] text-white p-4 rounded-full shadow-[0_15px_35px_rgba(86,188,54,0.3)] transition-all duration-300 transform group-hover:scale-110 active:scale-95 flex items-center justify-center">
        <MessageCircle className="w-8 h-8 md:w-9 md:h-9" fill="currentColor" />
      </div>

      {/* Label Tooltip (Muncul saat Hover) */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
        Chat Admin Kami
      </span>
    </button>
  );
};

export default WhatsAppButton;
