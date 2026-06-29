import { useState, useEffect } from 'react';

/**
 * =========================================================================
 * PETUGAS PEMBUKA TIRAI ETALASE (useProductGrid)
 * =========================================================================
 * Ibarat penanggung jawab tirai penutup di lemari panjang toko:
 * 1. Mengatur agar awalnya hanya 3 barang yang dibuka tirainya agar tamu.
 * 2. Jika tamu mengetuk tombol 'Lihat Lainnya', petugas ini membuka tirai untuk 3 barang berikutnya secara perlahan.
 */
export const useProductGrid = (products) => {
  const [visibleCount, setVisibleCount] = useState(3);

  // Reset count when category changes (which changes the products array)
  useEffect(() => {
    setVisibleCount(3);
  }, [products]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return {
    visibleCount,
    handleLoadMore,
    visibleProducts
  };
};
