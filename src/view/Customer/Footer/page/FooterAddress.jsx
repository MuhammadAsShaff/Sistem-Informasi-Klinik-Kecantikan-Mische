import React from 'react';

/**
 * =========================================================================
 * PLANG PAPAN ALAMAT KLINIK (FooterAddress)
 * =========================================================================
 * Ibarat papan ukir kayu di dinding lobi bawah yang mencantumkan peta dan
 * tulisan alamat lengkap gedung klinik, agar tamu tidak salah mendatangi tempat.
 */
const FooterAddress = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-6 text-left">
      <h4 className="text-white text-lg md:text-2xl font-bold tracking-widest w-fit pb-1">
        Alamat
      </h4>
      <p className="text-white text-xs md:text-lg leading-relaxed font-medium">
        Jl. Polowijen No. 1, Polowijen, Kecamatan Blimbing, Kota Malang 65126
      </p>
    </div>
  );
};

export default FooterAddress;
