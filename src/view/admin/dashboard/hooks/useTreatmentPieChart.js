import { useMemo } from 'react';

export const useTreatmentPieChart = (data) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.kategoriReservasi || 'Unknown',
      value: parseInt(item.total) || 0
    }));
  }, [data]);

  return { chartData };
};
