import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export function useFetchEvent() {
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.event);
  const [events, setEvents] = useState([]);
  const isLoading = isCacheLoading;

  useEffect(() => {
    if (data) {
      const eventData = data.data || data;
      setEvents(Array.isArray(eventData) ? eventData : []);
    }
  }, [data]);

  const fetchEvents = async () => {
    mutate();
  };

  return { events, isLoading, refetch: fetchEvents };
}
