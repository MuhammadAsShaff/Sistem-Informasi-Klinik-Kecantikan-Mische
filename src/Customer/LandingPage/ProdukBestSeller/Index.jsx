import React from 'react';

const products = [
  {
    id: 1,
    title: "WHITENING SERIES",
    description: "Membantu mencerahkan kulit wajah dan menyamarkan noda hitam secara efektif.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "ACNE SERIES",
    description: "Mengatasi masalah jerawat dan kulit berminyak dengan formula yang menenangkan.",
    image: "https://images.unsplash.com/photo-1556228515-4198e8f7319f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "ANTI AGING SERIES",
    description: "Menyamarkan tanda penuaan dini dan menjaga kekenyalan kulit wajah.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b70fb9107?auto=format&fit=crop&q=80&w=400",
  }
];

export default function ProdukBestSeller() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[#8cc461] text-2xl md:text-3xl font-bold text-center mb-20 max-w-4xl mx-auto leading-snug">
          Rawat Kulit Cantikmu Dari Rumah. Temukan Produk Best Seller Pilihan Kami.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[50px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center text-center transition-all duration-300 hover:translate-y-[-15px]">
              <div className="w-full aspect-square mb-8 overflow-hidden rounded-[40px] shadow-inner bg-gray-50">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[#215410] text-3xl font-black mb-4 italic tracking-tighter">{p.title}</h3>
              <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed font-medium">
                {p.description}
              </p>
              <button className="bg-[#8cc461] text-white px-10 py-3.5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#215410] transition-colors">
                Lihat Produk
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
