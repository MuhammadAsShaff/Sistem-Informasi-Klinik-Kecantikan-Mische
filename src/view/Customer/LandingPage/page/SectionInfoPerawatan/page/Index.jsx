import React from 'react';
import LogoMischee from '@/assets/images/LogoMischee.png';
import TreatmentBanner from './TreatmentBanner';
import TreatmentCard from './TreatmentCard';
import { treatments } from '../hooks/TreatmentsData';

/**
 * =========================================================================
 * ANJUNGAN PAMERAN MENU PERAWATAN (SectionInfoPerawatan)
 * =========================================================================
 * Ibarat panggung peragaan memanjang di halaman samping klinik. Di ujung kiri
 * berdiri panji spanduk besar (TreatmentBanner), diikuti barisan tiang plakat (TreatmentCard)
 * yang memandu tamu menjelajahi opsi perawatan unggulan.
 */
const SectionInfoPerawatan = () => {

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-20 overflow-hidden">
      {/* WRAPPER GESER UTAMA: Mengaktifkan Snap Scroll agar pergerakan halus dan serentak */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-12 gap-6 md:gap-10 items-stretch">
        
        {/* PANEL PEMBUKA (BANNER) */}
        <TreatmentBanner logo={LogoMischee} />

        {/* LIST KARTU PERAWATAN */}
        {treatments.map((item) => (
          <TreatmentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default SectionInfoPerawatan;
