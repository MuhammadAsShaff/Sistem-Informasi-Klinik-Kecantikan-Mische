import React from 'react';
import { useNavigate } from 'react-router-dom';
import gambarEvent from '@/assets/images/gambar event.png';
import bgEvent from '@/assets/images/gambar event yang berlangsung.png';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const formatTanggalSingkat = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div 
      onClick={() => navigate(`/event/${event.idEvent || event.id}`)}
      className="bg-white rounded-tl-[60px] rounded-br-[60px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative w-full h-[220px] bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
        {/* Placeholder image representation */}
        <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply bg-gray-200">
          {event.foto ? (
             <img src={event.foto.startsWith('http') ? event.foto : `${STORAGE_BASE_URL}${String(event.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`} alt={event.nama} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${gambarEvent})` }}></div>
          )}
        </div>
        
        {/* Date Tag */}
        <div className="absolute top-4 left-4 bg-[#56BC36] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
          {formatTanggalSingkat(event.tanggalMulai)}
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-6 flex flex-col flex-grow bg-cover bg-center"
      >
        <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 leading-snug">{event.nama}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {event.deskripsi}
        </p>
      </div>
    </div>
  );
}
