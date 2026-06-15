import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  '#018401',       // 100% opacity
  '#018401CC',     // 87% opacity (tebal)
  '#01840199',     // 65% opacity (sedang)
  '#30AE30',     // 76 opacity (tipis)
  '#78CA78'      // 72% opacity (paling tipis)
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={500}>
      {name}
    </text>
  );
};

const TreatmentPieChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.jenisTreatment || 'Unknown',
      value: parseInt(item.total) || 0
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden">
      <h3 className="font-bold text-gray-800 text-center mb-1">Reservasi Treatment</h3>
      <p className="text-sm text-gray-500 text-center mb-6">treatment yang paling banyak diminati</p>
      <div className="h-[250px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">Belum ada data reservasi treatment.</div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPieChart;
