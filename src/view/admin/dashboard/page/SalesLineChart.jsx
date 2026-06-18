import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const filters = ['1M', '3M', '6M', '1Y', 'ALL'];

const SalesLineChart = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState('1M');

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
      return chartData; // Return full year
    }

    // Return last N months up to current month (no wrapping for simplicity, just slice)
    const startIndex = Math.max(0, currentMonthIndex - numMonths + 1);
    return chartData.slice(startIndex, currentMonthIndex + 1);
  };

  const filteredChartData = getFilteredData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-[2] border border-gray-100 w-full overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-1 text-center">Grafik Penjualan Perbulan</h3>
          <p className="text-sm text-gray-500">Melihat Pertumbuhan Bisnis</p>
        </div>
      </div>
      <div className="h-[250px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              tickFormatter={(value) => {
                if (value >= 1000000) return `Rp ${value / 1000000}Jt`;
                if (value >= 1000) return `Rp ${value / 1000}K`;
                return `Rp ${value}`;
              }}
              width={65}
            />
            <Tooltip 
              cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
              formatter={(value) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value), 'Penjualan']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#018401" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#018401', strokeWidth: 0 }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === filter
                ? 'bg-[#56BC36] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SalesLineChart;
