import { useState } from 'react';
import gambarProduk from '@/assets/images/Gambar_Produk.png';

export const useProdukData = () => {
  const [activeCategory, setActiveCategory] = useState('semua');

  // Dummy product data
  const products = [
    {
      id: 1,
      name: 'Serum Acne',
      price: 'Rp 700.000',
      category: 'acne',
      image: gambarProduk
    },
    {
      id: 2,
      name: 'Serum Acne',
      price: 'Rp 700.000',
      category: 'acne',
      image: gambarProduk
    },
    {
      id: 3,
      name: 'Serum Acne',
      price: 'Rp 700.000',
      category: 'acne',
      image: gambarProduk
    }
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'semua' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return {
    products,
    activeCategory,
    setActiveCategory,
    filteredProducts
  };
};
