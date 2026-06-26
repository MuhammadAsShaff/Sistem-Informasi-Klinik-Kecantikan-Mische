import React from 'react';
import { Link } from 'react-router-dom';
import JenisPerawatanCard from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/page/JenisPerawatanCard';
import { useDetailJenisPerawatan } from '../hooks/useDetailJenisPerawatan';

/**
 * =========================================================================
 * KOMPONEN VIEW: DetailJenisPerawatan (Halaman Pilihan Jenis Perawatan)
 * =========================================================================
 * Komponen ini hanya merender tampilan (UI/Layout) dari daftar jenis perawatan
 * spesifik berdasarkan kategori yang diklik (misal: Facial, Botox, Laser).
 * 
 * Seluruh logika parameter URL, pencarian data kategori, penyaringan perawatan,
 * dan pengaturan posisi scroll diatur di dalam custom hook `useDetailJenisPerawatan`.
 */
const DetailJenisPerawatan = () => {
  const { category, items, navigate } = useDetailJenisPerawatan();


  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen pb-20">
      {/* Banner Area */}
      <div className="w-full h-64 md:h-80 relative overflow-hidden flex flex-col justify-center px-6 md:px-20 lg:px-32">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#56BC36]/90 via-[#56BC36]/60 to-transparent"></div>
        </div>
        
        {/* Banner Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
            {category.title}
          </h1>
          <p className="text-white text-lg md:text-xl font-medium drop-shadow-md">
            {category.description}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5c6e84] hover:text-[#56BC36] transition-colors mb-8 group"
        >
          <svg className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[17px] font-semibold">Kembali</span>
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-[#56BC36] text-center mb-10">
          Pilihan {category.title} Yang Cocok Untukmu
        </h2>

        {/* Grid Cards */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {items.map((item) => (
              <div key={item.id} className="w-full max-w-[380px]">
                <JenisPerawatanCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <p>Belum ada jenis perawatan untuk kategori ini.</p>
            <Link to="/" className="text-[#56BC36] underline mt-4 inline-block">Kembali ke Beranda</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailJenisPerawatan;
