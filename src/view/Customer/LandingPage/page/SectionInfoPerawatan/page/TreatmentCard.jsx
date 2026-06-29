import React from 'react';
import { Link } from 'react-router-dom';

/**
 * =========================================================================
 * KARTU PLAKAT RINGKASAN PERAWATAN (TreatmentCard)
 * =========================================================================
 * Ibarat tiang penyangga brosur di atas meja lobi. Saat tamu menatap fotonya,
 * fotonya perlahan mendekat (scale-110), menyuguhkan rangkuman singkat dan
 * tombol kilat menuju ruang penjelasan selengkapnya.
 */
const TreatmentCard = ({ item }) => {
  return (
    <div 
      className="snap-start shrink-0 w-[200px] md:w-[280px] bg-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col group transition-all duration-300"
    >
      {/* BAGIAN FOTO */}
      <div className="h-64 md:h-50 overflow-hidden rounded-tl-[60px]">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* ISI KONTEN */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-[#56BC36] text-lg md:text-xl font-bold mb-3">{item.title}</h3>
        <div className="h-[1.5px] w-full bg-gray-100 mb-4"></div>
        <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed font-medium">
          {item.description}
        </p>

        {/* TOMBOL */}
        <div className="mt-auto">
          <Link 
            to={`/perawatan/${item.id}`}
            className="bg-[#56BC36] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#2da509] transition-colors w-full shadow-md flex justify-center items-center"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;
