import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const useDashboard = () => {
  const { data, isLoading: isCacheLoading, error: cacheError, mutate } = useFetchWithCache(endpoints.admin.dashboard);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const loading = isCacheLoading;

  useEffect(() => {
    if (cacheError) {
      setError(cacheError.response?.data?.message || 'Terjadi kesalahan sistem');
    }
  }, [cacheError]);

  useEffect(() => {
    if (data) {
      setDashboardData(data.data || data);
      setError(null);
    }
  }, [data]);

  const fetchDashboardData = async () => {
    mutate();
  };

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
