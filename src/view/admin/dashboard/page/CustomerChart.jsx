import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomerChart = ({ data }) => {
  const [activeFilter, setActiveFilter] = React.useState('1M');
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

  const filteredChartData = getFilteredData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden flex flex-col">
      <div>
        <h3 className="font-bold text-gray-800 mb-1 text-center">Grafik Customer Perbulan</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">Pertumbuhan customer baru tahun ini</p>
      </div>
      <div className="h-[250px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#018401" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#018401" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} width={40} />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            />
            <Bar dataKey="value" fill="url(#colorCustomer)" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-2 mt-auto">
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

export default CustomerChart;
