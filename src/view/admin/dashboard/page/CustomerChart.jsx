import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomerChart = ({ data }) => {
  const chartData = monthNames.map((month, index) => {
    const monthKey = String(index + 1).padStart(2, '0');
    return {
      name: month,
      value: data ? data[monthKey] || 0 : 0
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden">
      <h3 className="font-bold text-gray-800 mb-1">Grafik Customer Perbulan</h3>
      <p className="text-sm text-gray-500 mb-6">Pertumbuhan customer baru tahun ini</p>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip cursor={{fill: '#f3f4f6'}} />
            <Bar dataKey="value" fill="#018401" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerChart;
