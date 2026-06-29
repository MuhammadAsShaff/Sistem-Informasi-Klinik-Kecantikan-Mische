import React from 'react';

/**
 * =========================================================================
 * PLANG JUDUL MADING TESTIMONI (TestimoniHeader)
 * =========================================================================
 * Ibarat papan nama marmer berukir emas di atas area pameran ulasan yang
 * menegaskan bahwa dinding ini khusus menampilkan kesaksian jujur dari para tamu klinik.
 */
const TestimoniHeader = () => {
  return (
    <div className="flex justify-start mb-8 lg:mb-12">
      <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] py-3 px-6 md:py-4 md:px-10 shadow-sm inline-block">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#5cb85c]">
          Testimoni Customer
        </h1>
      </div>
    </div>
  );
};

export default TestimoniHeader;
