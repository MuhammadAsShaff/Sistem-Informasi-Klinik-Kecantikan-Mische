import React from 'react';
// Mengimpor perkakas pembuat lintasan balok dari gudang perkakas 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Mengimpor asisten penilai juara bertahan produk
import { useTopProductsChart } from '../hooks/useTopProductsChart';

/** 
 * =========================================================================
 * PAPAN SIRKUIT BALAPAN JUARA (TopProductsChart)
 * =========================================================================
 * Bayangkan komponen ini sebagai "Papan Sirkuit Balapan Tamiya" di dinding mading.
 * Tugas utamanya: Membentangkan balok-balok horizontal mendatar (mirip jalur balap) 
 * untuk memamerkan urutan ranking 5 produk yang paling buas diborong pelanggan 
 * bulan ini. Balok yang meluncur paling jauh ke kanan adalah sang Juara Bertahan!
 */

const TopProductsChart = ({ data }) => {
  // Meminta asisten 'useTopProductsChart' menyortir buku kasir dari backend.
  // Asisten menyerahkan berkas 'chartData' yang sudah sangat rapi berisi piala nama produk dan skor terjualnya.
  const { chartData } = useTopProductsChart(data);

  return (
    // Wadah utama sirkuit: Kotak putih elegan bersudut melengkung dengan bingkai halus (border-gray-100)
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden">
      
      {/* ======================================================================
          BAGIAN 1: PAPAN NAMA SIRKUIT
          ====================================================================== */}
      <h3 className="font-bold text-gray-800 text-center mb-1">Produk Terlaris Bulan Ini</h3>
      <p className="text-sm text-gray-500 text-center mb-6">5 produk dengan penjualan terbanyak</p>
      
      {/* ======================================================================
          BAGIAN 2: ARENA LINTASAN BALOK MENDATAR
          ====================================================================== */}
      {/* Arena mendatar setinggi 250px tempat balok-balok diluncurkan */}
      <div className="h-[250px] w-full">
        
        {/* PEMERIKSAAN TIKET BALAPAN (CONDITIONAL RENDERING):
            Kita intip dulu apakah ada produk yang laku terjual (chartData.length > 0).
            - JIKA ADA: Buka gerbang sirkuit dan luncurkan balok balapannya.
            - JIKA KOSONG: Pasang plang peringatan 'Belum ada data penjualan produk'. */}
        {chartData.length > 0 ? (
          
          // ResponsiveContainer menjaga panggung sirkuit tetap pas di segala jenis ukuran layar
          <ResponsiveContainer width="100%" height="100%">
            
            {/* BarChart dengan layout="vertical": INILAH JURUS RAHASIA YANG MENGUBAH TIANG BERDIRI MENJADI BALOK TIDUR (MENDATAR) */}
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 40, left: 20, bottom: 0 }}
            >
              
              {/* defs: Tempat mencampur kaleng cat zamrud kemilau khusus untuk punggung balok */}
              <defs>
                <linearGradient id="colorProduct" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#1AA367" stopOpacity={0.7}/> {/* Cat hijau lembut di garis start */}
                  <stop offset="95%" stopColor="#1AA367" stopOpacity={1}/> {/* Cat hijau pekat tajam di garis finish */}
                </linearGradient>
              </defs>

              {/* CartesianGrid: Kawat harmonika tegak di latar belakang sebagai pembatas jarak */}
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              
              {/* XAxis (Sumbu Mendatar): Menjadi pengukur meteran angka jumlah barang terjual (0, 50, 100, dst.) */}
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              
              {/* YAxis (Sumbu Tegak di Kiri): Memajang plang nama-nama produk (Misal: Serum, Toner, Facial Wash) */}
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} width={90} />
              
              {/* Tooltip: Kotak bisikan melayang saat balok produk disentuh kursor mouse */}
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              
              {/* Bar: Balok horizontalnya!
                  - fill="url(#colorProduct)": Disiram dengan cat zamrud kemilau di atas.
                  - label: Mengukir angka pasti (misal: 120) di ujung kanan gerbong balok. */}
              <Bar dataKey="value" fill="url(#colorProduct)" radius={[0, 4, 4, 0]} barSize={18} label={{ position: 'right', fill: '#1AA367', fontSize: 12, fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Plang Cadangan jika tidak ada satu pun produk yang terjual bulan ini
          <div className="flex justify-center items-center h-full text-gray-400">Belum ada data penjualan produk.</div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;

