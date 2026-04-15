import React from 'react';
import Logo from '../assets/LogoMische.png';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a4d0c] text-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-20 mb-8">
        
        {/* LOGO */}
        <div className="flex flex-col items-center md:items-start justify-center">
          <img 
            src={Logo} 
            alt="Logo Mische" 
            className="h-24 md:h-32 w-auto brightness-0 invert opacity-90"
          />
        </div>

        {/* ALAMAT */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h4 className="text-[#8cc461] text-2xl font-black italic uppercase tracking-widest border-b-2 border-[#8cc461] w-fit mx-auto md:mx-0 pb-1">
            Alamat
          </h4>
          <p className="text-gray-300 text-lg leading-relaxed font-semibold">
            Jl. Polowijen No. 1, Polowijen, Kecamatan Blimbing, Kota Malang 65126
          </p>
        </div>

        {/* WAKTU OPERASIONAL */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h4 className="text-[#8cc461] text-2xl font-black italic uppercase tracking-widest border-b-2 border-[#8cc461] w-fit mx-auto md:mx-0 pb-1">
            Waktu Operasional
          </h4>
          <div className="text-gray-300 text-lg flex flex-col gap-2 font-semibold">
            <p>Setiap Hari</p>
            <p>09.00 - 20.00</p>
          </div>
        </div>

        {/* IKUTI KAMI */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h4 className="text-[#8cc461] text-2xl font-black italic uppercase tracking-widest border-b-2 border-[#8cc461] w-fit mx-auto md:mx-0 pb-1">
            Ikuti Kami
          </h4>
          <ul className="flex flex-col gap-4 text-gray-300 text-lg font-semibold">
            <li><a href="#" className="hover:text-[#8cc461] transition-color">Facebook</a></li>
            <li><a href="#" className="hover:text-[#8cc461] transition-color">Instagram</a></li>
            <li><a href="#" className="hover:text-[#8cc461] transition-color">TikTok</a></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-400 gap-6">
        <p className="font-bold tracking-wider">© 2024 Mische. All Rights Reserved.</p>
        <div className="flex gap-12 font-bold tracking-wider">
          <a href="#" className="hover:text-white transition-colors">Terms & Condition</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
