import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProdukData } from '../../../HalamanProduk/hooks/useProdukData';

export default function ProdukBestSeller() {
  const { products, isLoading } = useProdukData();
  const bestSellers = products ? products.slice(0, 3) : [];

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
        {isLoading ? (
          <div className="flex justify-center text-gray-500 py-10">Memuat produk best seller...</div>
        ) : (
          <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory gap-8 md:gap-12 px-2 md:px-0 py-6">
            {bestSellers.map((p) => (
              <div key={p.idProduk || p.id} className="snap-center shrink-0 w-[80vw] md:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* Tombol Lihat Lainnya */}
        {!isLoading && products && products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              to="/produk"
              className="bg-[#56BC36] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2da509] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Lihat Lainnya
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
