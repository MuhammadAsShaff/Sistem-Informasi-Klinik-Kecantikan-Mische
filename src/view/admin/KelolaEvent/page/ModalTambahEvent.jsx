import React from 'react';
// Mengimpor Asisten Penjaga Formulir Pendaftaran Baru (useModalTambahEvent) penyedia kertas kosong dan penyulap foto
import { useModalTambahEvent } from '../hooks/useModalTambahEvent';

/**
 * =========================================================================
 * MEJA FORMULIR PENDAFTARAN EVENT BARU (ModalTambahEvent)
 * =========================================================================
 * Ibarat sebuah meja panjang marmer putih tempat Asisten Penjaga Formulir
 * membentangkan kertas isian yang masih bersih tanpa coretan. Di meja ini admin
 * menuliskan nama, lokasi, tanggal, serta menyematkan potret promosi wajib
 * sebelum menekan tombol lonceng untuk mengutus kurir berlari ke server.
 */
export default function ModalTambahEvent({ isOpen, onClose, refetch, showToast }) {
  // ─── MEMINJAM KERTAS KOSONG & PENA DARI ASISTEN FORMULIR ───────────────────
  const {
    formData,      // Laci arsip penyimpan tulisan di atas kertas formulir baru
    isSubmitting,  // Rambu sibuk saat kurir sedang berlari membawa bungkusan pendaftaran ke server
    handleChange,  // Pena otomatis pencatat ketikan dan penyulap file foto
    handleSubmit   // Lonceng pengutus kurir ke pusat pendaftaran server
  } = useModalTambahEvent(refetch, showToast, onClose);

  // PENGAMAN MEJA: Jika tuas isOpen belum ditarik, meja formulir tetap tertutup tirai
  if (!isOpen) return null;

  return (
    // ─── TIRAI PENGABUR RUANG KERJA ──────────────────────────────────────────
    // Layar transparan gelap (z-50) yang melayang menutupi pekarangan balai
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* ─── KAIN PENYINGKIR MEJA (BACKDROP) ────────────────────────────────── */}
      {/* Kain hitam transparan (bg-black/40) yang jika ditekan akan merobohkan meja (onClose) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* ─── PAPAN MEJA FORMULIR MARMER ─────────────────────────────────────── */}
      {/* Papan marmer putih berfondasi lebar (max-w-4xl) bersudut melengkung (rounded-2xl) */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ─── KOP MEJA FORMULIR (HEADER) ───────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Tambah Event</h2>
          
          {/* Tombol silang (X) di sudut kanan atas untuk menutup meja formulir */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* ─── HAMPARAN KERTAS ISIAN (BODY KONTEN) ──────────────────────────── */}
        {/* Batasan tinggi meja formulir (max-h-[70vh]) bersiap meluncur vertikal (overflow-y-auto) jika isian padat */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* 
            KERTAS INDUK FORMULIR:
            - id="tambah-event-form": Tali pengikat sakti yang menghubungkan tombol Tambah di bawah meja dengan kertas ini.
            - onSubmit={handleSubmit}: Membunyikan lonceng kurir saat tombol Tambah ditekan.
          */}
          <form id="tambah-event-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* ─── LAJUR BARIS PERTAMA (GRID 2 KOLOM) ───────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* KOTAK ISIAN NAMA EVENT */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Event</label>
                <input 
                  type="text" 
                  name="nama" 
                  value={formData.nama} // Ditambatkan pada laci 'nama'
                  onChange={handleChange} // Digerakkan pena Asisten
                  placeholder="Nama Event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required // Wajib diisi, pantang kosong
                />
              </div>

              {/* KOTAK ISIAN LOKASI EVENT */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Lokasi</label>
                <input 
                  type="text" 
                  name="lokasi" 
                  value={formData.lokasi} // Ditambatkan pada laci 'lokasi'
                  onChange={handleChange}
                  placeholder="Lokasi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* KOTAK ISIAN TANGGAL MULAI */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalMulai" 
                    value={formData.tanggalMulai} // Ditambatkan pada laci 'tanggalMulai'
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                    required
                  />
                </div>
              </div>

              {/* KOTAK ISIAN TANGGAL SELESAI */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalSelesai" 
                    value={formData.tanggalSelesai} // Ditambatkan pada laci 'tanggalSelesai'
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                    required
                  />
                </div>
                {/* Peringatan ketat mengenai kaidah penanggalan */}
                <p className="text-[11px] text-red-500 italic mt-0.5">* Pastikan tanggal selesai &ge; tanggal mulai</p>
              </div>

            </div>

            {/* ─── LAJUR BARIS KEDUA (FOTO WAJIB & DESKRIPSI) ───────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LACI PEMASUKAN FOTO PROMOSI (WAJIB) */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Foto Event</label>
                <div className="flex items-center gap-3">
                  
                  {/* Trik menyembunyikan laci file asli di balik plang tombol hitam elegan */}
                  <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                    Choose File
                    <input 
                      type="file" 
                      name="foto" // Ditambatkan pada laci 'foto'
                      onChange={handleChange} // Memanggil penyulap gambar
                      className="sr-only" // Menyembunyikan tombol bawaan browser yang usang
                      required // Berbeda dengan form edit, foto di form tambah wajib hukumnya
                    />
                  </label>
                  
                  {/* Papan tulisan penunjuk nama file foto yang berhasil disulap */}
                  <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                    {formData.foto ? (formData.foto.name || "Gambar Terpilih") : "No File Chosen"}
                  </span>
                </div>
                <p className="text-[11px] text-red-500 italic mt-2">* Format: JPG/PNG/JPEG. Ukuran maksimal 2MB.</p>
              </div>

              {/* KOTAK CATATAN DESKRIPSI EVENT */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Event</label>
                <textarea 
                  name="deskripsi" 
                  value={formData.deskripsi} // Ditambatkan pada laci 'deskripsi'
                  onChange={handleChange}
                  placeholder="Deskripsi Event"
                  rows="4" // Tinggi standar 4 baris tulisan
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm resize-none"
                  required
                ></textarea>
              </div>

            </div>

          </form>
        </div>

        {/* ─── KAKI MEJA FORMULIR (FOOTER MODAL) ────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          {/* Tombol lonceng hijau besar pembawa formulir pendaftaran ke server */}
          <button 
            type="submit"
            form="tambah-event-form" // Terikat erat pada tali id form di atas
            disabled={isSubmitting} // Terkunci erat selama kurir lari ke server
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#45a025] text-white"
            }`}
          >
            {/* Teks berganti menenangkan saat kurir berlari */}
            {isSubmitting ? "Menyimpan..." : "Tambah Event"}
          </button>
        </div>

      </div>
    </div>
  );
}
