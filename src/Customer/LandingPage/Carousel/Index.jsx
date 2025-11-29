import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";

import Card1 from "./Card1";
import Card2 from "./Card2";
import Card3 from "./Card3";

export default function Hero() {
  return (
    <section className="w-full h-[550px] md:h-[650px] lg:h-[700px] relative">

      {/* ARROW LEFT */}
      <button className="swiper-button-prev-custom absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50">
        ❮
      </button>

      {/* ARROW RIGHT */}
      <button className="swiper-button-next-custom absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50">
        ❯
      </button>

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
