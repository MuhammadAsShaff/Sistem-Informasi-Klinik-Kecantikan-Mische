import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <section className="py-8 px-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10 px-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="bg-[#56BC36] hover:bg-[#2da509] text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition duration-300">
            Lihat Produk Lainnya
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
