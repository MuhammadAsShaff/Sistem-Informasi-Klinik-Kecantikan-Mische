import { useState } from 'react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const useSalesLineChart = (data) => {
  const [activeFilter, setActiveFilter] = useState('1M');
  const filters = ['1M', '3M', '6M', '1Y', 'ALL'];

  const chartData = monthNames.map((month, index) => {
    const monthKey = String(index + 1).padStart(2, '0');
    return {
      name: month,
      value: data ? data[monthKey] || 0 : 0
    };
  });

  const getFilteredData = () => {
    const currentMonthIndex = new Date().getMonth(); // 0-11
    let numMonths = 12;
    if (activeFilter === '1M') numMonths = 1;
    else if (activeFilter === '3M') numMonths = 3;
    else if (activeFilter === '6M') numMonths = 6;

    if (numMonths === 12 || activeFilter === 'ALL' || activeFilter === '1Y') {
      return chartData;
    }

    const startIndex = Math.max(0, currentMonthIndex - numMonths + 1);
    return chartData.slice(startIndex, currentMonthIndex + 1);
  };

  return {
    activeFilter,
    setActiveFilter,
    filters,
    filteredChartData: getFilteredData()
  };
};
