import React from 'react';
import { Link } from 'react-router-dom';
import { useDokterData } from '../hooks/useDokterData';

export default function TentangDokterDropdown() {
  const { doctors } = useDokterData();

  return (
    <div className="min-h-screen bg-gray-50/50 pt-8 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Badge */}
        <div className="mb-12 flex justify-center md:justify-start">
          <div className="bg-white inline-block px-12 py-5 rounded-2xl md:rounded-l-2xl md:rounded-r-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h1 className="text-4xl md:text-5xl font-bold text-[#56BC36] tracking-wide">
              Tentang Dokter
            </h1>
          </div>
        </div>

        {/* Grid Dokter */}
        <div className="grid grid-cols-1 md:flex md:flex-wrap md:justify-start gap-10">
          {doctors.map((dokter) => (
            <div 
              key={dokter.id} 
              className="relative w-full max-w-[360px] mx-auto md:mx-0 h-[500px] rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-2xl group transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Gambar Dokter */}
              <img 
                src={dokter.image} 
                alt={dokter.name} 
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#215410]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white"></div>
              
              {/* Konten Text */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-3">
                <h3 className="text-white text-3xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: dokter.name.replace(' ', '<br />') }}>
                </h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed mb-2">
                  {dokter.experience}
                </p>
                <Link to={`/dokter/${dokter.id}`} className="bg-[#56BC36] hover:bg-[#469A2B] text-white px-6 py-2.5 rounded-full text-sm font-bold w-fit shadow-lg transition-colors border border-white/20 hover:border-white/50 text-center">
                  Selengkapnya
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
