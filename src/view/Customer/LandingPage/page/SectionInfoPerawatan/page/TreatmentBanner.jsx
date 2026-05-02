import React from 'react';

const TreatmentBanner = ({ logo }) => {
  return (
    <div className="snap-start shrink-0 w-[85vw] md:w-[450px] lg:w-[550px] bg-[linear-gradient(225deg,#C6FFD1_0%,#56BC36_50%)] p-8 md:p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-center shadow-lg">
      {/* WATERMARK LOGO MISCHE (Bottom aligned) */}
      <div className="absolute right-[-5%] bottom-0 pointer-events-none w-[250px] md:w-[350px]">
        <img 
          src={logo} 
          alt="Mische Watermark" 
          className="w-full"
        />
      </div>

      <div className="relative z-10">
        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-6 leading text-white">
          Temukan Perawatan Wajah Dan Kulit Terbaik Dari Mische Aesthetic Clinic
        </h2>
        <p className="text-sm md:text-base lg:text-lg opacity-90 leading-relaxed font-medium">
          Temukan Perawatan Wajah Dan Kulit Terbaik Bersama Mische Aesthetic Clinic, Yang Menghadirkan Beragam Pilihan Treatment Berkualitas Untuk Memenuhi Kebutuhan Kecantikan...
        </p>
      </div>
    </div>
  );
};

export default TreatmentBanner;
