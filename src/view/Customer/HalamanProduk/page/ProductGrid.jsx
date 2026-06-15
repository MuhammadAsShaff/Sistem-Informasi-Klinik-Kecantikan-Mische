import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  // Reset count when category changes (which changes the products array)
  useEffect(() => {
    setVisibleCount(3);
  }, [products]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="w-full pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-10 px-4 md:px-16 lg:px-48">
        {visibleProducts.map((product) => (
          <ProductCard key={product.idProduk || product.id} product={product} />
        ))}
      </div>
      
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
