import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useFetchEvent() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get(endpoints.admin.event);
      if (res.data) {
        const eventData = res.data.data?.data || res.data.data || res.data;
        setEvents(Array.isArray(eventData) ? eventData : []);
      }
    } catch (error) {
      console.error("Gagal memuat data event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, isLoading, refetch: fetchEvents };
}
