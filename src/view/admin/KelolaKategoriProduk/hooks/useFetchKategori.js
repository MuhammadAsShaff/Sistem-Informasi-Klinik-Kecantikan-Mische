import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export function useFetchKategori() {
  const [categories, setCategories] = useState([]);
  
  const { data: catRes, isLoading: catLoading, mutate: mutateCat } = useFetchWithCache(endpoints.admin.kategori);
  const { data: countRes, isLoading: countLoading, mutate: mutateCount } = useFetchWithCache(endpoints.admin.kategoriCount);

  const isLoading = catLoading || countLoading;

  useEffect(() => {
    if (catRes) {
      const catData = Array.isArray(catRes.data) ? catRes.data : (Array.isArray(catRes) ? catRes : []);
      const countData = Array.isArray(countRes?.data) ? countRes.data : (Array.isArray(countRes) ? countRes : []);

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
  }, [catRes, countRes]);

  const fetchCategories = async () => {
    mutateCat();
    mutateCount();
  };

  return { categories, isLoading, refetch: fetchCategories };
}
