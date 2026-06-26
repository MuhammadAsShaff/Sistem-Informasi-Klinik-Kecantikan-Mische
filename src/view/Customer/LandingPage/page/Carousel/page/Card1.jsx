import React from 'react';
import HeroGirl from '@/assets/images/Bg-Hero.png';

export default function Card1() {
  return (
    // KONTEN UTAMA: Menggunakan Gradient Hijau Mische
    <div className="w-full h-full bg-gradient-to-r from-[#215410] via-[#56BC36] to-[#C6FFD1] overflow-hidden relative flex items-center">
      
      {/* CONTAINER: Menjaga konten tetap di tengah layar */}
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-full">
        
        {/* BAGIAN TEKS (Z-Index 20 agar di atas gambar) */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-6 text-white max-w-[70%] md:max-w-[800px] text-left items-start z-20">
          
          {/* JUDUL: Ukuran teks otomatis membesar dari Mobile (text-xl) ke Desktop (lg:text-7xl) */}
          <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-bold leading-tight">
            <span className="block">THE FIRST ACNE EXPERT </span>
            <span className="block">IN TOWN</span>
          </h1>

          {/* SUB-TEXT / LABEL: Menggunakan background hijau muda transparan */}
          <p className="max-w-[90%] sm:max-w-[80%] md:max-w-[500px] bg-[#85C583] px-3 py-1.5 md:px-6 md:py-3 text-white font-regular text-[10px] sm:text-xs md:text-lg lg:text-[28px] shadow-lg leading-snug break-words">
            Atasi Berbagai Masalah Kulit dan Wajah
          </p>

          {/* TOMBOL AKSI: Menggunakan hover efek agar interaktif */}
          <button className="w-fit whitespace-nowrap bg-[#85C583] px-3 py-1.5 md:px-6 md:py-3 rounded-full text-[12px] sm:text-sm md:text-lg lg:text-[26px] font-regular hover:bg-[#2da509] transition duration-300 shadow-lg mt-1 md:mt-2">
            Lihat Promo
          </button>
        </div>

        {/* BAGIAN GAMBAR (Posisi Absolute agar bisa menumpuk) */}
        {/* w-[40%] untuk Mobile, md:w-[50%] untuk Desktop */}
        {/* -translate-x-4 geser dikit di HP, md:-translate-x-20 geser banyak di Laptop agar tidak kena Gradasi Gelap */}
        <div className="absolute right-0 bottom-0 h-full w-[40%] md:w-[50%] flex items-end justify-end pointer-events-none transform -translate-x-4 md:-translate-x-20 lg:-translate-x-40">
          <img 
            src={HeroGirl} 
            alt="Hero" 
            className="h-[85%] md:h-[85%] w-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      {/* INDIKATOR SLIDE (Garis 3 di bawah) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        <div className="w-10 h-1.5 bg-white rounded-full"></div> {/* Status Aktif (Slide 1) */}
        <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
        <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
}
