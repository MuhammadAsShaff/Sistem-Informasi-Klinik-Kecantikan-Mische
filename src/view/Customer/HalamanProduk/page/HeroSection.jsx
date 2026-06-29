import React from 'react';
import { ShoppingCart } from 'lucide-react';
import bgProduk from '@/assets/images/BG_halaman_produk.png';
import bgDaun from '@/assets/images/Daun_Halaman_Produk.png';

/**
 * =========================================================================
 * GERBANG PENYAMBUTAN TAMAN PRODUK (HeroSection)
 * =========================================================================
 * Ibarat gapura megah berwarna hijau zamrud di pintu masuk taman skincare.
 * Gapura ini menyambut tamu dengan ucapan hangat dan menyediakan tombol 'Lihat Produk'
 * yang jika ditekan akan mengantarkan tamu meluncur mulus langsung ke hadapan deretan etalase.
 */
const HeroSection = () => {
  const handleScrollToProducts = () => {
    const element = document.getElementById('katalog-produk');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-[#56BC36] from-20% md:from-30% to-[#C6FFD1] pt-20 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center relative z-10">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-white mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md">
            Produk MISCHE Skincare
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-sm">
            Pilihan Cerdas Untuk Kulit Sehat Dan Terawat
          </p>
          <button 
            onClick={handleScrollToProducts}
            className="bg-white text-gray-800 hover:text-green-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center mx-auto md:mx-0 gap-2 cursor-pointer"
          >
            <ShoppingCart size={20} className="text-green-500" />
            Lihat Produk
          </button>
        </div>

        
        {/* ini untuk gambar bg hero */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
            {/* Background daun */}
            <img 
              src={bgDaun} 
              alt="Daun Background" 
              className="absolute inset-0 w-full h-full object-contain z-0 scale-125 md:scale-150  opacity-95"
            />
            {/* Gambar utama produk */}
            <img 
              src={bgProduk} 
              alt="Mische Skincare Products" 
              className="w-full h-full object-contain drop-shadow-2xl z-10 relative scale-110 md:scale-125"
            />
          </div>
        </div>
      </div>

      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 200" 
        className="absolute bottom-0 left-0 w-full -mb-1" 
        preserveAspectRatio="none" 
        style={{ height: "12vw", minHeight: "60px" }}
      >
        <path fill="#ffffff" fillOpacity="1" d="M0,100 C360,200 1080,200 1440,100 L1440,200 L0,200 Z"></path>
      </svg>
    </section>
  );
};

export default HeroSection;
