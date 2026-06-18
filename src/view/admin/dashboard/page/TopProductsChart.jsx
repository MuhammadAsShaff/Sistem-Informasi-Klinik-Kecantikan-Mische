import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopProductsChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.produk?.nama || 'Unknown',
      value: parseInt(item.total_terjual) || 0
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden">
      <h3 className="font-bold text-gray-800 text-center mb-1">Produk Terlaris Bulan Ini</h3>
      <p className="text-sm text-gray-500 text-center mb-6">5 produk dengan penjualan terbanyak</p>
      <div className="h-[250px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 40, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorProduct" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#1AA367" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#1AA367" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} width={90} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="url(#colorProduct)" radius={[0, 4, 4, 0]} barSize={18} label={{ position: 'right', fill: '#1AA367', fontSize: 12, fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">Belum ada data penjualan produk.</div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;
