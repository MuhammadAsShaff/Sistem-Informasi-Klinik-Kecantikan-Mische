import React from 'react';
import { doctors } from './DoctorsData';
import DoctorCard from './DoctorCard';

export default function DoctorSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Judul: Hijau dan rata tengah */}
        <h2 className="text-[#56BC36] text-2xl md:text-3xl lg:text-[32px] font-bold text-center mb-16 max-w-4xl mx-auto leading-snug">
          Dokter Kami Siap Membantu Merawat Dan Menjawab Kebutuhan Kulitmu.
        </h2>

        <div className="flex flex-nowrap md:grid md:grid-cols-2 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory gap-6 md:gap-10 lg:gap-20 max-w-5xl mx-auto px-4 md:px-0">
          {doctors.map((doc) => (
            <div key={doc.id} className="snap-center shrink-0 w-[85vw] md:w-full">
              <DoctorCard doc={doc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
