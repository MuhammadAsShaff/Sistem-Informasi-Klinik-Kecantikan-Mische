import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PromoCard({ promo }) {
  const navigate = useNavigate();
  const isActive = promo.status === "Aktif";

  // Format tanggal untuk tampilan (misal: 24 Nov 2025)
  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div 
      onClick={() => navigate(`/promo/${promo.id}`)}
      className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group relative border border-gray-100"
    >
      {/* Ribbon */}
      <div className="absolute top-0 left-0 z-10 overflow-hidden w-[140px] h-[140px] rounded-tl-[24px]">
        <div className={`absolute w-[200px] h-[200px] -top-[100px] -left-[100px] transform -rotate-45 flex items-end justify-center pb-2 shadow-md
          ${isActive ? 'bg-[#56BC36]' : 'bg-[#CC3333]'}`}
        >
          <span className="text-white font-bold text-[18px] tracking-wide text-center leading-tight">
            {isActive ? (
              <>Masih<br />Berlaku</>
            ) : (
              <>Tidak<br />Berlaku</>
            )}
          </span>
        </div>
      </div>

      {/* Image Area */}
      <div className="w-full h-[200px] bg-gray-100 relative overflow-hidden">
        {/* Placeholder gradient as image fallback for now */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-6 text-center">
           <h3 className="text-4xl font-black text-green-600 mb-2 drop-shadow-sm opacity-50">{promo.diskon || "PROMO"}</h3>
           <p className="text-green-800 font-bold opacity-70 bg-white/50 px-4 py-1 rounded-full text-sm">Mische Aesthetic Clinic</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">{promo.nama}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {promo.deskripsi}
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <div className={`inline-block px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors
            ${isActive ? 'bg-[#56BC36]' : 'bg-[#CC3333]'}
          `}>
            Berlaku Hingga {formatTanggal(promo.tanggalSelesai)}
          </div>
        </div>
      </div>
    </div>
  );
}
