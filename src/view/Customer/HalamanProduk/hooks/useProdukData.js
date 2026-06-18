import { useState } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const useProdukData = () => {
  const [activeCategory, setActiveCategory] = useState('semua');

  // Fetch using SWR-like cache with global TTL
  const { data: productsData, isLoading: isProdLoading } = useFetchWithCache(endpoints.customer.product);
  const { data: categoriesData, isLoading: isCatLoading } = useFetchWithCache(endpoints.admin.kategori);

  const products = productsData || [];
  let categories = categoriesData || [];

  // Fallback category extraction if API fails
  if (categories.length === 0 && products.length > 0) {
     const uniqueCategoriesMap = new Map();
     products.forEach(p => {
       if (p.kategori) {
         uniqueCategoriesMap.set(p.kategori.idKategori, p.kategori);
       }
     });
     categories = Array.from(uniqueCategoriesMap.values());
  }

  const isLoading = isProdLoading || (isCatLoading && categories.length === 0);

  // Filter products based on active category
  const filteredProducts = activeCategory === 'semua' 
    ? products 
    : products.filter(product => {
        const catId = product.kategori?.idKategori || product.idKategori;
        return catId?.toString() === activeCategory?.toString();
      });

  return {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    filteredProducts,
    isLoading
  };
};
