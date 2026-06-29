import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Card1 from "./Card1";
import Card2 from "./Card2";
import Card3 from "./Card3";

/**
 * =========================================================================
 * PANGGUNG UTAMA KOMIDI PUTAR (HeroCarousel)
 * =========================================================================
 * Ibarat roda panggung berputar megah (Swiper) di beranda istana klinik.
 * Panggung ini dijaga oleh petugas mesin pemutar yang secara otomatis mengganti
 * layar presentasi (Card1, Card2, Card3) setiap 4 detik, dilengkapi tuas panah
 * kiri-kanan agar tamu bisa mempercepat atau memutar ulang pameran.
 */
export default function Hero() {
  return (
    <section className="w-full h-[350px] sm:h-[450px] md:h-[650px] lg:h-[700px] relative overflow-hidden">

      {/* ARROW LEFT (Kapsul Vertikal) */}
      <button className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white w-10 h-16 md:w-14 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group">
        <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
      </button>

      {/* ARROW RIGHT (Kapsul Vertikal) */}
      <button className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white w-10 h-16 md:w-14 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group">
        <ChevronRight className="w-6 h-6 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
      </button>

      {/* GRADASI OVERLAY KIRI (Opacity) */}
      <div className="absolute left-0 top-0 h-full w-[100px] md:w-[150px] bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none"></div>
      
      {/* GRADASI OVERLAY KANAN (Opacity) */}
      <div className="absolute right-0 top-0 h-full w-[100px] md:w-[150px] bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none"></div>

      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        className="w-full h-full"
      >
        <SwiperSlide><Card1 /></SwiperSlide>
        <SwiperSlide><Card2 /></SwiperSlide>
        <SwiperSlide><Card3 /></SwiperSlide>
      </Swiper>

    </section>
  );
}
