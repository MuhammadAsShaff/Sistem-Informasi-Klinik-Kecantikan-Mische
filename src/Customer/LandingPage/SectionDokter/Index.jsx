import React from 'react';
import DokterWidya from "../../../assets/DokterWidya.jpg";
import DokterRiefni from "../../../assets/DokterRiefni.jpg";

const doctors = [
  {
    id: 1,
    name: "Dr. WIDYA FINANDA",
    description: "Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja...",
    image: DokterWidya,
  },
  {
    id: 2,
    name: "Dr. RIEFNI SILARA DINI",
    description: "Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja...",
    image: DokterRiefni,
  }
];

export default function DoctorSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Judul: Hijau dan rata tengah */}
        <h2 className="text-[#8cc461] text-2xl md:text-3xl lg:text-[32px] font-bold text-center mb-16 max-w-4xl mx-auto leading-snug">
          Dokter Kami Siap Membantu Merawat Dan Menjawab Kebutuhan Kulitmu.
        </h2>

        {/* 
            GRID DOKTER:
            - grid-cols-1: 1 Kolom di HP (Susun ke bawah)
            - md:grid-cols-2: 2 Kolom di Laptop (Berjejer samping)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 max-w-5xl mx-auto">
          {doctors.map((doc) => (
            <div 
              key={doc.id}
              className="relative group overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02]"
              // borderRadius: 60px/15px ini yang membuat pojoknya melengkung unik (Kiri Atas & Kanan Bawah Besar)
              style={{ borderRadius: '60px 15px 60px 15px' }}
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
                <h3 className="text-2xl font-black mb-2 -tight uppercase">
                  {doc.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-200 mb-6 line-clamp-2 font-medium opacity-90">
                  {doc.description}
                </p>
                <button className="bg-[#8cc461] text-white px-8 py-2.5 rounded-full text-sm font-bold w-fit hover:bg-white hover:text-[#215410] transition-colors shadow-lg">
                  Lihat Profil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
