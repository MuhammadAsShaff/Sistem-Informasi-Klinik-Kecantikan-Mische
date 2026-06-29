import React from 'react';
// Mengimpor lambang kaca pembesar (Search), panah tambah (Plus), pena edit (Edit), dan tempat sampah (Trash2)
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * =========================================================================
 * TABEL SIMULASI JADWAL (Ibarat Tabel Contoh di Toko)
 * =========================================================================
 * File ini ibarat "Tabel Contoh (Mockup)".
 * Disiapkan khusus untuk memperlihatkan rancangan bentuk tabel jadwal 
 * menggunakan 10 contoh jadwal kosong (data dummy), lengkap dengan 
 * kotak pencarian dan tombol pilihan di setiap barisnya.
 */
const JadwalTable = () => {
  // DAFTAR CONTOH JADWAL: Membuat 10 baris jadwal contoh bernomor id 1
  const data = Array(10).fill({ id: 1, jamMulai: '', jamSelesai: '' });

  return (
    /*
      KOTAK PEMBUNGKUS TABEL:
      'bg-white rounded-md shadow-sm border border-gray-100' membuat tabel berlatar putih bersih dengan sudut melengkung dan sedikit bayangan.
    */
    <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100">
      
      {/* ========================================================================= */}
      {/* 1. BAGIAN ATAS TABEL (KOTAK PENCARIAN & TOMBOL TAMBAH) */}
      {/* ========================================================================= */}
      <div className="flex justify-end items-center p-6 gap-3">
        
        {/* KOTAK KETIK PENCARIAN: Kotak ketik yang memiliki garis tepi hijau (#56BC36) saat diklik */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari..." 
            className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#56BC36] w-64"
          />
        </div>
        
        {/* TOMBOL KACA PEMBESAR HIJAU */}
        <button className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-[#4aa52e]">
          <Search size={20} />
        </button>
        
        {/* TOMBOL TAMBAH HIJAU (+) */}
        <button className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-[#4aa52e]">
          <Plus size={20} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. BAGIAN TABEL UTAMA (DAFTAR JADWAL) */}
      {/* ========================================================================= */}
      {/* 'overflow-x-auto' memastikan tabel bisa digeser ke samping jika layar sempit */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          
          {/* JUDUL KOLOM TABEL (THEAD): Tulisan abu-abu dengan huruf besar (uppercase) */}
          <thead className="bg-[#FDFDFD] text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-center text-xs">No</th>
              <th className="px-6 py-4 text-center text-xs">Jam Mulai</th>
              <th className="px-6 py-4 text-center text-xs">Jam Selesai</th>
              <th className="px-6 py-4 text-center text-xs">Action</th>
            </tr>
          </thead>
          
          {/* DAFTAR BARIS JADWAL (TBODY): Menampilkan 10 baris contoh dari data dummy */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.map((item, index) => (
              // 'hover:bg-gray-50': Jika kursor diarahkan ke baris ini, latar belakangnya menjadi abu-abu lembut
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-1 text-center">{index + 1}</td>
                <td className="px-6 py-1 h-12 text-center">{item.jamMulai}</td>
                <td className="px-6 py-1 text-center">{item.jamSelesai}</td>
                
                {/* KOLOM TOMBOL PILIHAN (EDIT & HAPUS) */}
                <td className="px-6 py-1 text-center">
                  <div className="flex justify-center gap-4">
                    {/* TOMBOL EDIT: Berwarna biru saat disentuh */}
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Edit size={22} />
                    </button>
                    {/* TOMBOL HAPUS: Berwarna merah saat disentuh */}
                    <button className="text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JadwalTable;
