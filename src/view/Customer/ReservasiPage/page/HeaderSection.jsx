import React from 'react';
import logomischee from '@/assets/images/LogoMischee.png';

// Section Banner paling atas
export default function HeaderSection() {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#56bc36] from-[55%] to-[#C6FFD1] rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 lg:p-20 overflow-hidden shadow-2xl shadow-green-900/20 animate-in fade-in slide-in-from-top duration-700">
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-4xl font-bold text-white leading-tight md:leading-[1.1] drop-shadow-md text-left">
          Jadwal Reservasi Treatment <br className="hidden sm:block" />
          Di Klinik Kecantikan Mische
        </h1>
      </div>

      {/* Logo Aspect */}
      <div className="absolute right-0 top-0 h-full w-1/3 sm:w-1/4 pointer-events-none flex items-center justify-end p-4 sm:p-12 z-10">
        <img
          src={logomischee}
          alt="Mische Logo"
          className="h-2/3 sm:h-full w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent shadow-inner"></div>
    </div>
  );
}
