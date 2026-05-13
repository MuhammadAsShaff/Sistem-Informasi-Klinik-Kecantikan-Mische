import React from 'react';

const DoctorCard = ({ doc }) => {
  return (
    <div 
      className="relative group overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02] rounded-tl-[60px] rounded-br-[60px]"
    >
      {/* IMAGE CONTAINER */}
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img 
          src={doc.image} 
          alt={doc.name} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#215410]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
        <h3 className="text-2xl font-bold mb-2 -tight uppercase">
          {doc.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-200 mb-6 line-clamp-3 font-medium opacity-90">
          {doc.description}
        </p>
        <button className="bg-[#56BC36] text-white px-8 py-2.5 rounded-full text-sm font-semibold w-fit hover:bg-[#2da509] transition-colors shadow-lg">
          Lihat Profil
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
