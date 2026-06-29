import React from 'react';

/**
 * =========================================================================
 * MADING UTAMA TESTIMONI PILIHAN (FeaturedTestimoni)
 * =========================================================================
 * Ibarat bingkai emas raksasa di tengah dinding lobi klinik yang memajang
 * kisah kesuksesan pasien paling berkesan. Pajangan ini memikat tamu dengan
 * foto besar dan cerita ulasan menyentuh dari pengalaman nyata perawatan.
 */
const FeaturedTestimoni = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-12 items-stretch">
      {/* Image Section */}
      <div className="w-full lg:w-[45%] rounded-tr-[40px] rounded-bl-[40px] overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Featured Testimonial" 
          className="w-full h-full object-cover min-h-[300px] lg:min-h-[400px]"
        />
      </div>
      
      {/* Content Section */}
      <div className="w-full lg:w-[55%] bg-white rounded-tl-[40px] rounded-br-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] p-8 lg:p-12 flex flex-col justify-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">
          Bintang Puspita Dewi
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 mb-6 lg:mb-8">
          <span className="bg-[#5cb85c] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm">
            23 Nov 2025
          </span>
          <span className="text-[#5cb85c] font-bold text-lg lg:text-xl">
            Treatment Acne
          </span>
        </div>
        
        <p className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">
          Pada Tanggal 23 November 2025, Bintang Puspita Dewi Melakukan Treatment Acne Di Mische Aesthetic Clinic. Ia Menyampaikan Rasa Sangat Puas Dan Senang Dengan Hasil Perawatan Yang Diberikan. Menurutnya, Pelayanan Yang Ramah, Tenaga Profesional, Serta Hasil Yang Terasa Nyata Membuat Pengalamannya Di Klinik Ini Sangat Menyenangkan Dan Melebihi Ekspektasi.
        </p>
      </div>
    </div>
  );
};

export default FeaturedTestimoni;
