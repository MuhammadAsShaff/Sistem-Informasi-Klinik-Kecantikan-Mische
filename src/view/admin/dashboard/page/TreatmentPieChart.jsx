import React from 'react';
// Mengimpor perkakas pencetak kue bundar dari gudang perkakas 'recharts'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// Mengimpor asisten pemotong kue porsi reservasi
import { useTreatmentPieChart } from '../hooks/useTreatmentPieChart';

/** 
 * =========================================================================
 * NAMPAN SAJI KUE PIZZA RESERVASI (TreatmentPieChart)
 * =========================================================================
 * Bayangkan komponen ini sebagai "Nampan Saji Kue Pizza" di atas meja mading.
 * Tugas utamanya: Membagi sebuah lingkaran padat menjadi potongan-potongan porsi 
 * (persis seperti memotong kue pizza) untuk memvisualisasikan jenis treatment 
 * apa yang paling buas dibooking/di-reservasi oleh pelanggan.
 * Semakin besar porsi irisan kuenya = Semakin laris manis treatment tersebut!
 */

// =========================================================================
// PALET 5 TOPING WARNA HIJAU
// =========================================================================
// Menyiapkan 5 kaleng selai warna hijau dari yang pekat hingga pastel.
// Nantinya setiap irisan kue akan diolesi satu selai dari daftar ini secara bergiliran.
const COLORS = [
  '#018401',       // Selai Hijau Tua Pekat (100% padat)
  '#018401CC',     // Selai Hijau Zamrud Terang (80% padat)
  '#01840199',     // Selai Hijau Lembut (60% padat)
  '#30AE30',       // Selai Hijau Daun Terang
  '#78CA78'        // Selai Hijau Pastel Paling Manis
];

const TreatmentPieChart = ({ data }) => {
  // Meminta asisten 'useTreatmentPieChart' memotong-motong buku reservasi dari backend.
  // Hasilnya adalah nampan 'chartData' yang berisi daftar nama treatment dan jumlah pemesannya.
  const { chartData } = useTreatmentPieChart(data);

  return (
    // Wadah utama nampan: Kotak putih bersih bersudut melengkung dengan bayangan halus
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-gray-100 w-full overflow-hidden flex flex-col">
      
      {/* ======================================================================
          BAGIAN 1: PLANG NAMA NAMPAN
          ====================================================================== */}
      <h3 className="font-bold text-gray-800 text-center mb-1">Reservasi Treatment</h3>
      <p className="text-sm text-gray-500 text-center mb-6">kategori treatment yang paling banyak diminati</p>
      
      {/* ======================================================================
          BAGIAN 2: ARENA PENYAJIAN KUE PIZZA (PIE CHART)
          ====================================================================== */}
      <div className="flex-1 w-full min-h-[250px]">
        
        {/* PEMERIKSAAN MEJA RESERVASI (CONDITIONAL RENDERING):
            Kita intip apakah ada pelanggan yang mem-booking treatment (chartData.length > 0).
            - JIKA ADA: Kita hidangkan piring potongan kuenya di atas meja.
            - JIKA KOSONG: Kita pasang plang sedih 'Belum ada data reservasi treatment'. */}
        {chartData.length > 0 ? (
          // ResponsiveContainer menjaga piring piringan tetap bundar harmonis di layar apa pun
          <ResponsiveContainer width="100%" height="100%">
            
            {/* PieChart: Piring keramik saji tempat kue diletakkan */}
            <PieChart>
              
              {/* Pie: Kue bundar padat utamanya!
                  - cx & cy: Meletakkan titik pusat kue tepat di tengah piring (50%, 45%).
                  - outerRadius={90}: Menentukan seberapa montok ukuran diameternya.
                  - innerRadius={0}: 0 berarti kuenya utuh padat di tengah (bukan kue donat yang bolong di tengah!).
                  - dataKey="value": Mengambil besaran irisan dari jumlah orang pemesan. */}
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={0} 
                dataKey="value"
                stroke="none"
              >
                {/* Looping (Mengolesi selai tiap irisan):
                    Setiap porsi (Cell) akan diolesi selai warna dari daftar 'COLORS' di atas.
                    stroke="#ffffff" memberi krim pemisah warna putih bersih di antara irisan kue. */}
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              
              {/* Tooltip: Kotak bisikan melayang yang muncul saat kursor menyentuh salah satu irisan kue */}
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#374151', fontWeight: 500 }}
              />
              
              {/* Legend: Daftar menu keterangan toping di bagian bawah nampan saji
                  (Contoh: [Bulatan Hijau Pekat] Facial Acne | [Bulatan Lembut] Peeling) */}
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle" // Jurus menyulap plester keterangan kotak menjadi bulatan manis
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          // Tampilan Cadangan jika tidak ada satu pun orang yang booking treatment
          <div className="flex justify-center items-center h-full text-gray-400">Belum ada data reservasi treatment.</div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPieChart;

