import React from 'react';
import { Ruler, Users, Sparkles, Activity, ThumbsUp } from 'lucide-react';

const advantages = [
  {
    id: 1,
    title: "Perawatan Yang Dipersonalisasi Sesuai Kondisi Kulit",
    description: "Untuk Perawatan Lebih Tepat",
    icon: <Ruler className="text-[#8cc461] w-12 h-12" />,
  },
  {
    id: 2,
    title: "Spesialisasi Perawatan Kulit Berjerawat",
    description: "Ditangani Oleh Dokter Berpengalaman",
    icon: <Users className="text-[#8cc461] w-12 h-12" />,
  },
  {
    id: 3,
    title: "Menggabungkan Relaksasi (Facial + Totok Wajah)",
    description: "Kesehatan Wajah",
    icon: <Sparkles className="text-[#8cc461] w-12 h-12" />,
  },
  {
    id: 4,
    title: "Pemantauan Hasil Yang Teratur",
    description: "Untuk Perawatan Lebih Tepat",
    icon: <Activity className="text-[#8cc461] w-12 h-12" />,
  },
  {
    id: 5,
    title: "Penggunaan Produk Skincare Berkualitas Tinggi",
    description: "Skincare Berkualitas Untuk Hasil Maksimal",
    icon: <ThumbsUp className="text-[#8cc461] w-12 h-12" />,
  }
];

export default function KeunggulanKlinik() {
  return (
    <section className="w-full py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[#1a4d0c] text-3xl md:text-4xl lg:text-5xl font-black text-center mb-24 max-w-4xl mx-auto leading-tight italic">
          Keunggulan Mische Dibanding Beauty Clinic Lain
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 max-w-6xl mx-auto">
          {advantages.map((item) => (
            <div key={item.id} className="flex gap-8 items-start group">
              <div className="shrink-0 p-5 bg-[#f8fcf4] rounded-[25px] shadow-sm group-hover:bg-[#8cc461] group-hover:scale-110 transition-all duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-[#1a4d0c] text-xl md:text-2xl font-black mb-2 leading-tight uppercase italic">{item.title}</h3>
                <p className="text-gray-500 text-sm md:text-lg font-bold opacity-80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON (AS SEEN IN SCREENSHOT) */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <a 
          href="https://wa.me/yournumber" 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#8cc461] text-white px-8 py-4 rounded-2xl flex items-center gap-4 shadow-[0_15px_30px_rgba(140,196,97,0.4)] hover:scale-110 active:scale-95 transition-all font-black"
        >
          <div className="bg-white text-[#8cc461] w-6 h-6 rounded flex items-center justify-center text-xs font-black">1</div>
          <span className="text-xl uppercase tracking-wider">Whatsapp</span>
        </a>
      </div>
    </section>
  );
}
