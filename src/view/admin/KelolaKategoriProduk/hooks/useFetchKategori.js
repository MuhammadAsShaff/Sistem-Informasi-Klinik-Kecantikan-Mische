import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useFetchKategori() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const [catRes, countRes] = await Promise.all([
        axiosClient.get(endpoints.admin.kategori),
        axiosClient.get(endpoints.admin.kategoriCount).catch(() => null) // Fallback if fails
      ]);

      if (catRes.data?.status === 'success') {
        const catData = Array.isArray(catRes.data.data) ? catRes.data.data : [];
        const countData = countRes?.data?.status === 'success' && Array.isArray(countRes.data.data) 
                          ? countRes.data.data 
                          : [];

        // Merge count into category
        const merged = catData.map(cat => {
          const matchedCount = countData.find(c => c.idKategori === cat.idKategori);
          return {
            ...cat,
            count: matchedCount ? matchedCount.jumlahProduk : 0
          };
        });

        setCategories(merged);
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, isLoading, refetch: fetchCategories };
}
