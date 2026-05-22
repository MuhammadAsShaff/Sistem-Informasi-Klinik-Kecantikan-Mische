import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function usePromoData() {
  const [promos, setPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPromos = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClient.get(endpoints.customer.promo);
        if (res.data) {
          const promoData = res.data.data?.data || res.data.data || res.data;
          setPromos(Array.isArray(promoData) ? promoData : []);
        }
      } catch (error) {
        console.error("Gagal memuat data promo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const filteredPromos = promos.filter(promo => 
    promo.namaPromo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { promos: filteredPromos, searchQuery, setSearchQuery, isLoading };
}
