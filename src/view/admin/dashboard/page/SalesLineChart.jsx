import React from 'react';
// Mengimpor perkakas pembuat tali grafik dari gudang perkakas 'recharts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Mengimpor asisten akuntan senior khusus untuk urusan omset
import { useSalesLineChart } from '../hooks/useSalesLineChart';

/** 
 * =========================================================================
 * LAYAR PROYEKTOR JALUR BUKIT OMSET (SalesLineChart)
 * =========================================================================
 * Bayangkan komponen ini sebagai "Layar Proyektor Jalur Bukit" di dinding mading.
 * Tugas utamanya: Membentangkan tali grafik mendaki dan menurun (mirip pemandangan 
 * bukit pegunungan atau grafik saham) untuk memantau apakah aliran uang omset 
 * klinik Mische sedang menanjak subur atau sedang turun dari bulan ke bulan.
 */

const SalesLineChart = ({ data }) => {

  /*
    MEMANGGIL ASISTEN AKUNTAN SENIOR (useSalesLineChart)
    Kita menyerahkan buku kasir mentah dari server (data) kepada asisten akuntan.
    Asisten akan menghidangkan 4 perbekalan matang:
    1. activeFilter     : Saklar waktu mana yang sedang menyala (misal: '1M', '3M').
    2. setActiveFilter  : Fungsi pengubah saklar saat tombol dipijat admin.
    3. filters          : Daftar menu tombol saklar (['1M', '3M', '6M', '1Y', 'ALL']).
    4. filteredChartData: Neraca matang berisi daftar nama bulan dan koordinat uang omsetnya.
  */
  const { activeFilter, setActiveFilter, filters, filteredChartData } = useSalesLineChart(data);

  return (
    // Wadah utama proyektor: Kotak putih elegan berbingkai tipis dengan porsi bentangan lebih lebar (flex-[2])
    <div className="bg-white p-6 rounded-xl shadow-sm flex-[2] border border-gray-100 w-full overflow-hidden">
      
      {/* ======================================================================
          BAGIAN 1: KOP SURAT / INFORMASI PROYEKTOR
          ====================================================================== */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-1 text-center">Grafik Penjualan Perbulan</h3>
          <p className="text-sm text-gray-500">Melihat Pertumbuhan Bisnis</p>
        </div>
      </div>

      {/* ======================================================================
          BAGIAN 2: ARENA PEMBENTANGAN TALI KURVA
          ====================================================================== */}
      {/* Panggung setinggi 250px sebagai arena membentangkan tali kurva */}
      <div className="h-[250px] w-full mb-4">

        {/* ResponsiveContainer: Menjaga tali grafik tetap lentur menyesuaikan lebar HP maupun Monitor */}
        <ResponsiveContainer width="100%" height="100%">

          {/* LineChart: Papan tulis utama untuk menancapkan paku-paku grafik */}
          <LineChart data={filteredChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            
            {/* CartesianGrid: Kawat harmonika putus-putus mendatar di latar belakang */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            {/* XAxis: Garis pijakan bawah tempat menempel stiker nama bulan (Jan, Feb, Mar, dst.) */}
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            
            {/* YAxis: Tiang meteran tegak di sebelah kiri tempat memajang patokan uang omset. */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              /*
                ASISTEN PENYINGKAT ANGKA MILIAR (tickFormatter)
                Angka uang itu panjang-panjang! Kalau ditulis Rp 1.000.000, layarnya penuh sesak.
                Asisten ini bertugas menyingkat angka panjang menjadi super ringkas:
                - 1.000.000 disulap jadi Rp 1Jt
                - 1.000 disulap jadi Rp 1K
              */
              tickFormatter={(value) => {
                if (value >= 1000000) return `Rp ${value / 1000000}Jt`;
                if (value >= 1000) return `Rp ${value / 1000}K`;
                return `Rp ${value}`;
              }}
              width={65}
            />

            {/* Tooltip: Kotak bisikan melayang saat kursor menunjuk titik puncak bukit */}
            <Tooltip 
              cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} // Tiang penunjuk vertikal abu-abu
              // Memoles angka di dalam kotak bisikan menjadi tulisan uang Rupiah asli yang lengkap
              formatter={(value) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value), 'Penjualan']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            />

            {/* Line: Tali kurva sutra utamanya!
                - type="monotone": Melenturkan tali kurva agar mendaki dengan mulus dan elegan (tidak patah-patah tajam seperti gigi hiu).
                - stroke="#018401": Mewarnai tali sutra dengan warna Hijau Mische.
                - dot & activeDot: Paku-paku penanda di setiap bulan yang membengkak indah saat disorot kursor. */}
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

      {/* ======================================================================
          BAGIAN 3: JEJERAN SAKLAR MESIN WAKTU (FILTER)
          ====================================================================== */}
      {/* Jejeran saklar di bawah proyektor untuk mengatur bentangan kertas laporan (1M, 3M, 6M, 1Y, ALL) */}
      <div className="flex justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            // Memberi tahu asisten akuntan untuk memotong kertas laporan saat saklar dipijat
            onClick={() => setActiveFilter(filter)}
            // Jika saklar ini sedang menyala, berikan warna hijau kemilau. Jika mati, warna abu-abu redup
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

