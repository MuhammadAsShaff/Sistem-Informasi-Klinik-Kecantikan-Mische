import { useState, useEffect } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get(endpoints.admin.dashboard);
      
      if (response.data && response.data.status === 'success') {
        setDashboardData(response.data.data);
      } else {
        setError('Gagal mengambil data dashboard');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
