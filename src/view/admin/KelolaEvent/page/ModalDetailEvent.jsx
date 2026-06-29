import React from 'react';
// Mengimpor ikon kalender dari pustaka lucide-react sebagai pemanis lambang penanggalan
import { Calendar } from 'lucide-react';

/**
 * =========================================================================
 * PETUGAS PLANG RINCIAN BIODATA EVENT (ModalDetailEvent)
 * =========================================================================
 * Ibarat seorang petugas santun yang membawa papan plang berisi rincian lengkap
 * biodata suatu event (nama, lokasi, tanggal, dan deskripsi). Petugas ini 
 * hanya mengizinkan Anda melihat (Hanya Baca), tidak ada pena atau penghapus
 * untuk mencoret-coret kertas di papan ini.
 */
export default function ModalDetailEvent({ isOpen, onClose, event }) {
  // ─── PENGAMAN LACI ARSIP ──────────────────────────────────────────────────
  // Jika tuas isOpen belum ditarik atau map biodata event kosong, petugas tetap diam di laci
  if (!isOpen || !event) return null;

  return (
    // ─── TIRAI PENGABUR BALAI KERJA ──────────────────────────────────────────
    // Layar gelap transparan (z-50) yang melayang menutupi meja-meja lain di sekelilingnya
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* ─── LATAR BELAKANG GELAP (BACKDROP) ────────────────────────────────── */}
      {/* Kain hitam tipis (bg-black/40) yang jika ditekan akan menyuruh petugas menutup plang (onClose) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* ─── PAPAN PLANG BIODATA MARMER ─────────────────────────────────────── */}
      {/* Papan marmer putih bersudut bundar (rounded-2xl) dengan bayangan megah (shadow-2xl) */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ─── KOP SURAT PAPAN PLANG (HEADER) ───────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Detail Event</h2>

          {/* Tombol silang (X) di sudut kanan atas untuk memulangkan petugas */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* ─── ISI SURAT BIODATA (BODY KONTEN) ──────────────────────────────── */}
        {/* Batasan tinggi meja surat (max-h-[70vh]) yang siap meluncur vertikal (overflow-y-auto) jika teks teramat panjang */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            
            {/* Pembatas meja yang membagi ruangan menjadi 2 lajur sejajar (grid-cols-2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ─── LAJUR NAMA EVENT ───────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Event</label>
                {/* Wadah abu-abu pudar (bg-gray-50) pelindung tulisan nama event */}
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {event.nama || "-"}
                </div>
              </div>

              {/* ─── LAJUR LOKASI EVENT ─────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Lokasi</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {event.lokasi || "-"}
                </div>
              </div>

              {/* ─── LAJUR TANGGAL MULAI ────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  {/* Menyulap kalender angka server menjadi kalender lokal Indonesia yang elok */}
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm appearance-none">
                    {event.tanggalMulai ? new Date(event.tanggalMulai).toLocaleDateString('id-ID') : "-"}
                  </div>
                  {/* Ikon kalender di sudut kanan laci */}
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

              {/* ─── LAJUR TANGGAL SELESAI ──────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm appearance-none">
                    {event.tanggalSelesai ? new Date(event.tanggalSelesai).toLocaleDateString('id-ID') : "-"}
                  </div>
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

            </div>

            {/* ─── LAJUR DESKRIPSI EVENT (LEBAR PENUH) ──────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Event</label>
              {/* whitespace-pre-wrap: Memastikan seluruh spasi dan ketukan baris baru dari penulis tetap asri terbaca */}
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap min-h-[100px]">
                {event.deskripsi || "-"}
              </div>
            </div>

          </div>
        </div>

        {/* ─── KAKI SURAT (FOOTER MODAL) ────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          {/* Tombol lonceng hijau penutup plang (onClose) */}
          <button 
            onClick={onClose}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
