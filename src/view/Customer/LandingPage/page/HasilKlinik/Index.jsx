import React from 'react';
import { results } from './HasilKlinikData';
import HasilKlinikCard from './HasilKlinikCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function HasilKlinik() {
  return (
    <section className="w-full bg-[#256E0F] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white text-3xl md:text-5xl font-semibold text-center mb-16 md:mb-20">
          Mische Clinic Dengan Hasil Nyata
        </h2>

        {/* Swiper Slider for Mobile and Desktop */}
        <div className="mb-20">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1.2}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="pb-16"
          >
            {results.map((item) => (
              <SwiperSlide key={item.id} className="h-full">
                <HasilKlinikCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tombol Reservasi Utama */}
        <div className="flex justify-center">
          <button className="bg-[#85C583] text-white px-14 py-5 rounded-full text-xl md:text-2xl font-regular shadow-2xl hover:bg-[#2da509] hover:text-white transition-all transform hover:scale-105">
            Reservasi Sekarang
          </button>
        </div>
      </div>

    </section>
  );
}
