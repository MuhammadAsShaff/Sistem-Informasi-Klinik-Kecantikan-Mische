import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { treatments } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/DataJenisPerawatan';
import JenisPerawatanCard from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/JenisPerawatanCard';

const DetailJenisPerawatan = () => {
  const { id } = useParams();
  
  // Ambil detail kategori perawatan dari treatments (Landing Page)
  const categoryId = parseInt(id) || 1;
  const category = treatments.find(t => t.id === categoryId) || treatments[0];

  // Filter data jenis perawatan berdasarkan categoryId
  const items = dataJenisPerawatan.filter(item => item.categoryId === categoryId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            {category.title}: Perawatan Dasar Wajah
          </h1>
          <p className="text-white text-lg md:text-xl font-medium">
            Kulit Bersih Dan Segar Dengan Perawatan Facial Rutin
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl pt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#56BC36] text-center mb-10">
          Pilihan {category.title} Yang Cocok Untukmu
        </h2>

        {/* Grid Cards */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {items.map((item) => (
              <JenisPerawatanCard key={item.id} item={item} />
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
