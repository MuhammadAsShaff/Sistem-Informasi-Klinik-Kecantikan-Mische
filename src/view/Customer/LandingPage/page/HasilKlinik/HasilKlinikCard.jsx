import React from 'react';

const HasilKlinikCard = ({ item }) => {
  return (
    <div className="group">
      <div className="flex w-full rounded-2xl overflow-hidden border-6 border-[#8cc461] hover:border-white transition-colors duration-300">
        <div className="relative w-1/2 overflow-hidden">
          <img src={item.before} alt="Before" className="w-full h-48 md:h-60 object-cover grayscale-[0.3]" />
          <span className="absolute top-2 left-2 bg-[#416B43] text-white text-[10px] font-medium px-4 py-1 rounded-full tracking-tighter">Before</span>
        </div>
        <div className="relative w-1/2 border-l-6 border-[#8cc461] overflow-hidden">
          <img src={item.after} alt="After" className="w-full h-48 md:h-60 object-cover" />
          <span className="absolute top-2 left-2 bg-[#416B43] text-white text-[10px] font-medium px-4 py-1 rounded-full tracking-tighter">After</span>
        </div>
      </div>
      <div className="w-full mt-6 bg-gradient-to-r from-[#266E0F] to-[#C6FFD1] py-4 text-center rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform">
        <span className="text-white font-bold text-xl tracking-widest">{item.title}</span>
      </div>
    </div>
  );
};

export default HasilKlinikCard;
