import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useFetchProduk() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.admin.products);
      if (res.data?.status === 'success') {
        const data = res.data.data;
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, isLoading, refetch: fetchProducts, updateLocalStock };
}
