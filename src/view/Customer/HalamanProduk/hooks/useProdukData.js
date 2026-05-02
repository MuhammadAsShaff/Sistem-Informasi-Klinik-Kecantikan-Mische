import { useState } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const useProdukData = () => {
  const [activeCategory, setActiveCategory] = useState('semua');

  // Menyusun URL endpoint berdasarkan kategori aktif
  const productEndpoint = activeCategory === 'semua' 
    ? endpoints.customer.product 
    : `${endpoints.customer.product}?idKategori=${activeCategory}`;

  // Fetch menggunakan public endpoint yang baru untuk kategori
  const { data: categoriesData, isLoading: isCatLoading } = useFetchWithCache(endpoints.customer.productCategories);
  const { data: productsData, isLoading: isProdLoading } = useFetchWithCache(productEndpoint);

  const products = productsData || [];
  const categories = categoriesData || [];

  const isLoading = isProdLoading || isCatLoading;

  // Karena sekarang backend sudah memfilter berdasarkan idKategori, kita tidak perlu filter manual lagi
  const filteredProducts = products;

  return {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    filteredProducts,
    isLoading
  };
};
