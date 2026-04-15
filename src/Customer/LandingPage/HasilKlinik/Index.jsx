import React from 'react';

const results = [
  {
    id: 1,
    title: "Botox",
    before: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=200",
    after: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=200&hue=100",
  },
  {
    id: 2,
    title: "MezoFlex",
    before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=200",
    after: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    title: "Lip Laser Rejuvenation",
    before: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200",
    after: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200",
  }
];

export default function HasilKlinik() {
  return (
    <section className="w-full bg-[#1a4d0c] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white text-3xl md:text-5xl font-black text-center mb-20 italic">
          Mische Clinic Dengan Hasil Nyata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {results.map((item) => (
            <div key={item.id} className="group">
              <div className="flex w-full rounded-2xl overflow-hidden border-2 border-[#8cc461] hover:border-white transition-colors duration-300">
                <div className="relative w-1/2 overflow-hidden">
                  <img src={item.before} alt="Before" className="w-full h-48 md:h-60 object-cover grayscale-[0.3]" />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Before</span>
                </div>
                <div className="relative w-1/2 border-l-2 border-[#8cc461] overflow-hidden">
                  <img src={item.after} alt="After" className="w-full h-48 md:h-60 object-cover" />
                  <span className="absolute top-2 left-2 bg-[#8cc461] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">After</span>
                </div>
              </div>
              <div className="w-full mt-6 bg-[#8cc461] py-4 text-center rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl italic uppercase tracking-widest">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-[#8cc461] text-white px-14 py-5 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:bg-white hover:text-[#1a4d0c] transition-all transform hover:scale-105">
            Reservasi Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
