import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export const useTestimoniData = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.get(endpoints.customer.testimonials);
        if (res.data?.success) {
          const rawData = res.data.data?.data || res.data.data || res.data;
          const dataArray = Array.isArray(rawData) ? rawData : [];
          
          // Map backend format to component props format
          const mappedData = dataArray.map(item => ({
            id: item.idTestimoni || item.id,
            name: item.namaTester,
            description: item.deskripsi,
            foto: item.buktiFoto
          }));
          
          setTestimonials(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return {
    testimonials,
    isLoading
  };
};
