import React from 'react';
// Mengimpor asisten pengatur isian formulir Excel
import { useModalExportExcel } from '../hooks/useModalExportExcel';

/**
 * =========================================================================
 * KOTAK POP-UP DOWNLOAD EXCEL (Ibarat Kotak Formulir Unduh Laporan)
 * =========================================================================
 * Ini adalah kotak pop-up (jendela kecil) yang muncul saat admin menekan tombol "Excel".
 * Di dalam kotak ini, admin bisa memilih ingin mendownload laporan untuk semua produk
 * atau produk tertentu saja, serta memilih rentang tanggal awal dan akhir.
 */
export default function ModalExportExcel({ isOpen, onClose, onExport }) {
  // 1. Memanggil asisten untuk mengambil daftar produk, nilai isian, dan fungsi simpan
  const { products, filters, handleChange, handleExport } = useModalExportExcel(onExport);

  // Jika pop-up tidak sedang dibuka (isOpen = false), jangan tampilkan apa-apa
  if (!isOpen) return null;

  return (
    // Latar belakang transparan gelap di belakang kotak pop-up
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Kotak putih pop-up utama */}
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 font-poppins">
        
        {/* --- BAGIAN ATAS KOTAK (Judul & Tombol Tutup) --- */}
        <div className="px-8 py-5 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-[22px] font-bold text-semibold">Export Excel</h3>
          {/* Tombol silang untuk menutup kotak pop-up */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* --- ISI FORMULIR PILIHAN --- */}
        <div className="p-8">
          <div className="space-y-6">
            
            {/* BAGIAN 1: MEMILIH PRODUK */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Produk</label>
                <select
                  name="idProduk"
                  value={filters.idProduk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm text-gray-700 cursor-pointer"
                >
                  <option value="semua">Semua Produk</option>
                  {/* Menampilkan seluruh daftar produk yang ada di toko */}
                  {products?.map((p) => (
                    <option key={p.idProduk || p.id} value={p.idProduk || p.id}>{p.nama || p.namaProduk}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BAGIAN 2: MEMILIH RENTANG TANGGAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tanggal Awal */}
              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="tanggalMulai"
                    value={filters.tanggalMulai}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm cursor-pointer"
                  />
                </div>
              </div>

              {/* Tanggal Akhir */}
              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="tanggalSelesai"
                    value={filters.tanggalSelesai}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BAGIAN BAWAH KOTAK (Tombol Eksekusi Download) --- */}
        <div className="px-8 py-5 border-t border-gray-300 flex justify-end mt-4">
          {/* Tombol "Export To Excel" untuk memulai proses unduh */}
          <button 
            type="button"
            onClick={handleExport}
            className="px-6 py-2.5 text-white font-medium rounded-md bg-[#56BC36] hover:bg-[#469e2c] cursor-pointer"
          >
            Export To Excel
          </button>
        </div>

      </div>
    </div>
  );
}
