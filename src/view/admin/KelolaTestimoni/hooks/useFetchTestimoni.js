import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export function useFetchTestimoni() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.testimonials);
  const [testimoni, setTestimoni] = useState([]);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      const testData = data.data || data;
      setTestimoni(Array.isArray(testData) ? testData : []);
    }
  }, [data]);

  const fetchTestimoni = async () => {
    mutate();
  };

  return { testimoni, isLoading, refetch: fetchTestimoni };
}
