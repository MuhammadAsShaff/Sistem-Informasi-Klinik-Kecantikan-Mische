import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export function useFetchProduk() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.products);
  const [products, setProducts] = useState([]);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      setProducts(Array.isArray(data) ? data : []);
    }
  }, [data]);

  const fetchProducts = async () => {
    mutate();
  };

  const updateLocalStock = (id, newStock) => {
    setProducts(prev => prev.map(p => {
      const productId = p.idProduk || p.id;
      if (productId === id) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  return { products, isLoading, refetch: fetchProducts, updateLocalStock };
}
