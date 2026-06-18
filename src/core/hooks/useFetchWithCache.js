import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/core/api/axiosClient';

// In-memory cache implementation
const cache = new Map();
const inFlightRequests = new Map();

/**
 * useFetchWithCache (SWR Pattern)
 * 
 * @param {string} url - Endpoint URL
 * @param {object} options - Konfigurasi cache & fetch
 * @param {number} options.ttl - Time To Live in milliseconds (default: 5 minutes)
 * @param {boolean} options.revalidateOnMount - Revalidate di background saat komponen dimount (default: true)
 * @param {boolean} options.enabled - Bolehkan fetch (default: true)
 * @param {function} options.onSuccess - Callback saat berhasil
 */
export const useFetchWithCache = (url, options = {}) => {
  const { 
    ttl = 15 * 1000, 
    revalidateOnMount = true, 
    enabled = true,
    onSuccess
  } = options;

  const [data, setData] = useState(() => {
    const cached = cache.get(url);
    if (cached) return cached.data;
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(() => !cache.has(url));
  const [error, setError] = useState(null);

  const fetcher = useCallback(async (isBackground = false) => {
    if (!url || !enabled) return;

    const cached = cache.get(url);
    const now = Date.now();

    // Jika dipanggil dan cache masih sangat segar (di bawah 2 detik untuk debouncing), skip
    if (cached && now - cached.timestamp < 2000) {
      if (!isBackground) {
         setData(cached.data);
         setIsLoading(false);
      }
      return;
    }

    if (!isBackground && !cached) {
      setIsLoading(true);
    }

    // Hindari request duplikat di waktu yang sama
    if (inFlightRequests.has(url)) {
      try {
        const res = await inFlightRequests.get(url);
        setData(res.data?.data || res.data);
      } catch (err) {
        setError(err);
      } finally {
        if (!isBackground && !cached) setIsLoading(false);
      }
      return;
    }

    const requestPromise = axiosClient.get(url);
    inFlightRequests.set(url, requestPromise);

    try {
      const res = await requestPromise;
      // Extract data automatically (handling standardized laravel responses)
      const responseData = res.data?.data || res.data;
      
      // Update cache
      cache.set(url, { data: responseData, timestamp: Date.now() });
      
      setData(responseData);
      if (onSuccess) onSuccess(responseData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      inFlightRequests.delete(url);
      setIsLoading(false);
    }
  }, [url, enabled, onSuccess]);

  useEffect(() => {
    if (!enabled || !url) return;

    const cached = cache.get(url);
    const now = Date.now();

    if (cached) {
      setData(cached.data);
      setIsLoading(false);

      // Revalidate in background if TTL expired or revalidateOnMount is true
      if (revalidateOnMount || now - cached.timestamp > ttl) {
        fetcher(true);
      }
    } else {
      // First load
      fetcher(false);
    }
  }, [url, enabled, fetcher, revalidateOnMount, ttl]);

  // Expose mutate untuk manual revalidation
  const mutate = useCallback(() => {
    cache.delete(url);
    return fetcher(false);
  }, [url, fetcher]);

  return { data, isLoading, error, mutate };
};

// Expose global invalidate (berguna jika ingin membersihkan cache spesifik setelah update/post)
export const invalidateCache = (urlPrefix) => {
  for (const key of cache.keys()) {
    if (key.includes(urlPrefix)) {
      cache.delete(key);
    }
  }
};
