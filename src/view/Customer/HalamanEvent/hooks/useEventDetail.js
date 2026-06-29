import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * ASISTEN PENJELAS RINCIAN ACARA (useEventDetail)
 * =========================================================================
 * Ibarat pemandu khusus di depan mimbar acara:
 * 1. Menerima tiket undangan tamu (ID dari URL).
 * 2. Membuka map arsip kegiatan untuk mencari kertas rincian acara yang nomornya persis sama.
 * 3. Menghaluskan format penulisan tanggal di kertas undangan agar mudah dan indah dipahami oleh tamu.
 */
export const useEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: rawEvent, isLoading } = useFetchWithCache(endpoints.customer.event, { ttl: 15000, revalidateOnMount: false });

  const event = useMemo(() => {
    if (!rawEvent) return null;
    const eventData = rawEvent?.data?.data || rawEvent?.data || rawEvent;
    const events = Array.isArray(eventData) ? eventData : [];
    return events.find(e => (e.idEvent || e.id).toString() === id) || null;
  }, [rawEvent, id]);

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return {
    navigate,
    isLoading,
    event,
    formatTanggal
  };
};
