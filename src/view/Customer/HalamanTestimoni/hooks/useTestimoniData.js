import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const useTestimoniData = () => {
  const { data, isLoading } = useFetchWithCache(endpoints.customer.testimonials);

  const rawData = data?.data || data || [];
  const dataArray = Array.isArray(rawData) ? rawData : [];
  
  // Map backend format to component props format
  const testimonials = dataArray.map(item => ({
    id: item.idTestimoni || item.id,
    name: item.namaTester,
    description: item.deskripsi,
    foto: item.buktiFoto
  }));

  return {
    testimonials,
    isLoading
  };
};
