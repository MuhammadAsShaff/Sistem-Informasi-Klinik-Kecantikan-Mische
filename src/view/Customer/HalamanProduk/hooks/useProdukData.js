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
        // Ambil produk
        let productsData = [];
        try {
          const prodRes = await axiosClient.get(endpoints.customer.product);
          if (prodRes.data?.status === 'success') {
            productsData = prodRes.data.data;
            setProducts(productsData);
          }
        } catch (prodErr) {
          console.error("Gagal memuat data produk:", prodErr);
        }

        // Ambil kategori secara terpisah, agar jika gagal (misal 401), produk tetap tampil
        let categoryData = [];
        try {
          const catRes = await axiosClient.get(endpoints.admin.kategori);
          if (catRes.data?.status === 'success') {
            categoryData = catRes.data.data;
            setCategories(categoryData);
          }
        } catch (catErr) {
          console.warn("Gagal memuat kategori produk dari API, mengekstrak dari produk...", catErr);
        }

        // Jika kategori gagal dimuat (kosong), kita ekstrak dari produk
        if (categoryData.length === 0 && productsData.length > 0) {
           const uniqueCategoriesMap = new Map();
           productsData.forEach(p => {
             if (p.kategori) {
               uniqueCategoriesMap.set(p.kategori.idKategori, p.kategori);
             }
           });
           setCategories(Array.from(uniqueCategoriesMap.values()));
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
