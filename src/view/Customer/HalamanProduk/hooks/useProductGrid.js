import { useState, useEffect } from 'react';

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
