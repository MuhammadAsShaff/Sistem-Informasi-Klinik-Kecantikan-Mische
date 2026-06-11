import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export const useProdukData = () => {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosClient.get(endpoints.customer.product),
          axiosClient.get(endpoints.admin.kategori) // Assuming customer can view all categories
        ]);

        if (prodRes.data?.status === 'success') {
          setProducts(prodRes.data.data);
        }
        
        if (catRes.data?.status === 'success') {
          setCategories(catRes.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data produk:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on active category
  const filteredProducts = activeCategory === 'semua' 
    ? products 
    : products.filter(product => {
        // Handle if category is object or string/id
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
