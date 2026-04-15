import React from 'react';
import LogoMischee from '../../../assets/LogoMischee.png';

const treatments = [
  {
    id: 1,
    title: "Regular Facial",
    description: "Perawatan dasar untuk membersihkan wajah dari kotoran, minyak, dan sel kulit mati.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Intensive Facial",
    description: "Perawatan wajah dengan teknologi modern untuk menangani masalah kulit lebih mendalam.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "Skin Peel",
    description: "Prosedur pengelupasan kulit untuk membantu meregenerasi sel kulit baru yang lebih sehat.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Acne Care",
    description: "Penanganan khusus untuk mengatasi masalah jerawat dan bekas jerawat secara efektif.",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    title: "Anti-Aging",
    description: "Perawatan intensif untuk mengurangi garis halus dan tanda-tanda penuaan dini.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    title: "Laser Glow",
    description: "Teknologi laser untuk mencerahkan kulit wajah dan mengecilkan pori-pori.",
    image: "https://images.unsplash.com/photo-1512290902247-4cf548ef8326?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 7,
    title: "Eye Treatment",
    description: "Perawatan khusus area mata untuk menyamarkan lingkaran hitam dan kantung mata.",
    image: "https://images.unsplash.com/photo-1498842812179-c81beecf902c?auto=format&fit=crop&q=80&w=400",
  }
];

export default function SectionInfoPerawatan() {
  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-20 overflow-hidden">
      {/* WRAPPER GESER UTAMA: Mengaktifkan Snap Scroll agar pergerakan halus dan serentak */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-12 gap-6 md:gap-10 items-stretch">
        
        {/* PANEL HIJAU: Pojok kanan atas terang (#C6FFD1), kiri atas gelap (#56BC36) */}
        <div className="snap-start shrink-0 w-[85vw] md:w-[450px] lg:w-[550px] bg-[linear-gradient(225deg,#C6FFD1_0%,#56BC36_50%)] rounded-[0px_0px_0px_0px] p-8 md:p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-center shadow-lg">
          {/* WATERMARK LOGO MISCHE (Bottom aligned) */}
          <div className="absolute right-[-5%] bottom-0 pointer-events-none w-[250px] md:w-[350px]">
            <img 
              src={LogoMischee} 
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

        {/* LIST KARTU PERAWATAN */}
        {treatments.map((item) => (
          <div 
            key={item.id} 
            className="snap-start shrink-0 w-[200px] md:w-[280px] bg-white rounded-[60px_15px_60px_15px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col group transition-all duration-300"
          >
            {/* BAGIAN FOTO */}
            <div className="h-64 md:h-50 overflow-hidden rounded-[60px_15px_0px_0px]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* ISI KONTEN (Padding dikurangi dari 8 menjadi 6) */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-[#56BC36] text-lg md:text-xl font-bold mb-3">{item.title}</h3>
              <div className="h-[1.5px] w-full bg-gray-100 mb-4"></div>
              <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed font-medium">
                Perawatan Dasar Untuk Membersihkan Wajah Dari Kotoran, Minyak, Dan Sel Kulit Mati.
              </p>

              {/* TOMBOL */}
              <div className="mt-auto">
                <button className="bg-[#56BC36] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#2da509] transition-colors w-full shadow-md">
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
