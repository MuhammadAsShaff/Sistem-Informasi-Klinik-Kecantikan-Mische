import React from 'react';
import ProductCard from './ProductCard';
import { useProductGrid } from '../hooks/useProductGrid';

const ProductGrid = ({ products }) => {
  const { visibleCount, handleLoadMore, visibleProducts } = useProductGrid(products);

  return (
    <div className="w-full pb-10">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 mb-6 text-gray-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak Ada Produk</h3>
          <p className="text-gray-500 text-center max-w-md">
            Belum ada produk yang tersedia untuk kategori ini. Silakan cek kategori lain atau kembali lagi nanti.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-10 px-4 md:px-16 lg:px-48">
          {visibleProducts.map((product) => (
            <ProductCard key={product.idProduk || product.id} product={product} />
          ))}
        </div>
      )}
      
      {products.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLoadMore}
            className="bg-[#56BC36] hover:bg-[#2da509] text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition duration-300"
          >
            Lihat Produk Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
