import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTreatmentPieChart } from '../hooks/useTreatmentPieChart';

/* 
 * =========================================================================
 * TREATMENT PIE CHART (GRAFIK POTONGAN KUE LAYANAN)
 * =========================================================================
 * Komponen ini membagi lingkaran seperti memotong kue pizza untuk melihat 
 * jenis treatment apa yang paling banyak di-reservasi oleh pelanggan.
 * Potongan kue terbesar = Treatment Paling Laris.
 */

// Menyiapkan warna-warna hijau gradasi untuk tiap potongan kue
const COLORS = [
  '#018401',       // 100% opacity (Hijau Tua)
  '#018401CC',     // 87% opacity (tebal)
  '#01840199',     // 65% opacity (sedang)
  '#30AE30',       // 76 opacity (tipis)
  '#78CA78'        // 72% opacity (paling tipis)
];

const TreatmentPieChart = ({ data }) => {
  const { chartData } = useTreatmentPieChart(data);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden flex flex-col">
      <h3 className="font-bold text-gray-800 text-center mb-1">Reservasi Treatment</h3>
      <p className="text-sm text-gray-500 text-center mb-6">kategori treatment yang paling banyak diminati</p>
      <div className="flex-1 w-full min-h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#374151', fontWeight: 500 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
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
