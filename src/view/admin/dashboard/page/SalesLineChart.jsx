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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-[2] border border-gray-100 w-full overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-1 text-center">Grafik Penjualan Perbulan</h3>
          <p className="text-sm text-gray-500">Melihat Pertumbuhan Bisnis</p>
        </div>
      </div>
      <div className="h-[200px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#018401" strokeWidth={3} dot={false} />
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
