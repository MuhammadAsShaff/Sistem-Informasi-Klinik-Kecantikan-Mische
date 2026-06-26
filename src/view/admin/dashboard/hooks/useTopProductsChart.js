import { useMemo } from 'react';

export const useTopProductsChart = (data) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.produk?.nama || 'Unknown',
      value: parseInt(item.total_terjual) || 0
    }));
  }, [data]);

  return { chartData };
};
