import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export function useEventData() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua'); // 'Semua', 'Akan Berlangsung', 'Sedang Berlangsung', 'Sudah Selesai'
  const { data: cacheData, isLoading } = useFetchWithCache(endpoints.customer.event);

  useEffect(() => {
    if (cacheData) {
      const rawData = cacheData.data?.data || cacheData.data || cacheData;
      const rawEvents = Array.isArray(rawData) ? rawData : [];
      const now = new Date();
      now.setHours(0,0,0,0);

      const eventsWithStatus = rawEvents.map(event => {
        let status = 'Akan Berlangsung';
        const startDate = new Date(event.tanggalMulai);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(event.tanggalSelesai);
        endDate.setHours(0,0,0,0);

        if (now > endDate) {
          status = 'Sudah Selesai';
        } else if (now >= startDate && now <= endDate) {
          status = 'Sedang Berlangsung';
        }
        return { ...event, status };
      });
      setEvents(eventsWithStatus);
    }
  }, [cacheData]);

  const filteredEvents = events.filter(event => {
    const titleMatch = event.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || "";
    const descMatch = event.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) || event.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) || "";
    const matchesSearch = titleMatch || descMatch;
    const matchesFilter = activeFilter === 'Semua' || event.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getCountByStatus = (status) => {
    return events.filter(e => e.status === status).length;
  };

  return { 
    events: filteredEvents, 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter,
    isLoading,
    summary: {
      akanBerlangsung: getCountByStatus('Akan Berlangsung'),
      sedangBerlangsung: getCountByStatus('Sedang Berlangsung'),
      sudahSelesai: getCountByStatus('Sudah Selesai')
    }
  };
}
