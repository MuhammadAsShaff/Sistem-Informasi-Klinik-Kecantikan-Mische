import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useFetchTestimoni() {
  const [testimoni, setTestimoni] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTestimoni = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.admin.testimonials);
      if (res.data?.success) {
        // Fallback checks just in case the data is wrapped
        const data = res.data.data?.data || res.data.data || res.data;
        setTestimoni(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data testimoni:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimoni();
  }, []);

  return { testimoni, isLoading, refetch: fetchTestimoni };
}
