import React from 'react';
// Mengimpor alat-alat konstruksi grafik dari gudang perkakas 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Mengimpor asisten ahli sensus khusus untuk menghitung pelanggan
import { useCustomerChart } from '../hooks/useCustomerChart';

/** 
 * =========================================================================
 * LAYAR PROYEKTOR PILAR HIJAU (CustomerChart)
 * =========================================================================
 * Bayangkan komponen ini sebagai "Layar Proyektor Raksasa" di dinding mading.
 * Tugas utamanya: Menerima kalender dari asisten sensus, lalu mendirikan 
 * tiang-tiang (pilar) hijau megah untuk memamerkan jumlah pelanggan baru 
 * yang masuk ke klinik Mische dari bulan ke bulan.
 */

const CustomerChart = ({ data }) => {
  /*
    MEMANGGIL ASISTEN AHLI SENSUS (useCustomerChart)
    Kita memanggil asisten dengan menyodorkan buku catatan mentah dari server (data).
    Asisten akan menyerahkan 4 perbekalan penting:
    1. activeFilter     : Saklar waktu mana yang sedang menyala (misal: '1M', '3M').
    2. setActiveFilter  : Tombol ajaib untuk memindahkan saklar waktu.
    3. filters          : Daftar menu tombol di meja (['1M', '3M', '6M', '1Y', 'ALL']).
    4. filteredChartData: Kalender yang sudah dipotong rapi dan siap didirikan tiang.
  */
  const { activeFilter, setActiveFilter, filters, filteredChartData } = useCustomerChart(data);

  return (
    // Wadah utama proyektor: Kotak putih elegan bersudut melengkung (rounded-xl) dengan bayangan halus
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden flex flex-col">
      
      {/* ======================================================================
          BAGIAN 1: KOP SURAT / JUDUL PROYEKTOR
          ====================================================================== */}
      <div>
        <h3 className="font-bold text-gray-800 mb-1 text-center">Grafik Customer Perbulan</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">Pertumbuhan customer baru tahun ini</p>
      </div>

      {/* ======================================================================
          BAGIAN 2: PANGGUNG TEMPAT TIANG DIDIRIKAN
          ====================================================================== */}
      {/* Panggung mendatar setinggi 250px sebagai arena mendirikan pilar */}
      <div className="h-[250px] w-full mb-4">
        
        {/* ResponsiveContainer: Penjaga kelenturan panggung agar bisa menyusut di HP dan melar di Laptop */}
        <ResponsiveContainer width="100%" height="100%">
          
          {/* BarChart: Fondasi dasar panggung tiang. Kita tuangkan kalender matang (filteredChartData) ke sini */}
          <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            
            {/* defs (Definitions): Tempat mencampur kaleng cat gradasi. Kita buat cat 'colorCustomer' */}
            <defs>
              <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#018401" stopOpacity={0.8} /> {/* Cat hijau pekat di puncak tiang */}
                <stop offset="95%" stopColor="#018401" stopOpacity={0.2} /> {/* Cat hijau tipis transparan di kaki tiang */}
              </linearGradient>
            </defs>

            {/* CartesianGrid: Kawat harmonika / garis bantu mendatar putus-putus di latar belakang agar angka gampang diintip */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            {/* XAxis: Garis sepatu mendatar di bawah tempat memajang stiker nama bulan (Jan, Feb, Mar, dst.) */}
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            
            {/* YAxis: Tiang meteran tegak di sebelah kiri untuk mengukur tinggi pelanggan (0, 10, 20, dst.) */}
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} width={40} />

            {/* Tooltip: Kotak bisikan melayang yang muncul saat kursor mouse menyentuh tiang grafik */}
            <Tooltip
              cursor={{ fill: '#f3f4f6' }} // Sorot bayangan abu-abu di belakang tiang saat disentuh
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            />
            
            {/* Bar: Pilar fisik utamanya! Tingginya diambil dari 'value' (jumlah pelanggan), diolesi cat gradasi 'colorCustomer', dan atapnya dipangkas melengkung (radius) */}
            <Bar dataKey="value" fill="url(#colorCustomer)" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ======================================================================
          BAGIAN 3: JEJERAN SAKLAR MESIN WAKTU (FILTER)
          ====================================================================== */}
      {/* Jejeran saklar waktu di bawah proyektor tempat admin memilih kalender */}
      <div className="flex justify-center gap-2 mt-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            // Saat saklar ini ditekan, suruh asisten sensus memotong ulang kalendernya
            onClick={() => setActiveFilter(filter)}
            // Jika saklar ini sedang menyala, poles dengan warna Hijau Daun (#56BC36). Jika mati, beri warna abu-abu redup
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeFilter === filter
              ? 'bg-[#56BC36] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {filter} {/* Menuliskan ukiran nama saklar: '1M', '3M', '6M', '1Y', atau 'ALL' */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerChart;
