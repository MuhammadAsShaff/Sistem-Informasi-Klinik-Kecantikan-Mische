import React from 'react';
import { products } from './ProductData';
import ProductCard from './ProductCard';

export default function ProdukBestSeller() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[#56BC36] text-2xl md:text-3xl font-bold text-center mb-20 max-w-4xl mx-auto leading-snug">
          Rawat Kulit Cantikmu Dari Rumah. Temukan Produk Best Seller Pilihan Kami.
        </h2>

        {/* 
            KENDALI LAYOUT:
            - Mobile: Flex Row + Horizontal Scroll (Slider)
            - Desktop (md): Grid 3 Kolom
        */}
        <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory gap-8 md:gap-12 px-2 md:px-0 py-6">
          {products.map((p) => (
            <div key={p.id} className="snap-center shrink-0 w-[80vw] md:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
