import React from 'react';
// Mengimpor Asisten Penjaga Formulir Edit (useModalPerbaruiEvent) pemegang pena dan penyulap foto
import { useModalPerbaruiEvent } from '../hooks/useModalPerbaruiEvent';

/**
 * =========================================================================
 * MEJA FORMULIR PERBAIKAN ARSIP (ModalPerbaruiEvent)
 * =========================================================================
 * Ibarat sebuah meja panjang bersudut lengkung tempat Asisten Penjaga Formulir
 * membentangkan kertas isian yang sudah diisi otomatis dengan data event lama.
 * Di meja ini admin bisa mencoret tulisan lama dan menggantinya dengan ketikan baru,
 * serta menyisipkan potret promosi baru sebelum menyuruh kurir berlari ke server.
 */
export default function ModalPerbaruiEvent({ isOpen, onClose, refetch, showToast, event }) {
  // ─── MEMINJAM PENA & TUAS DARI ASISTEN FORMULIR ────────────────────────────
  const {
    formData,      // Laci arsip penyimpan tulisan di atas kertas formulir
    isSubmitting,  // Rambu sibuk saat kurir sedang berlari membawa bungkusan ke server
    handleChange,  // Pena otomatis pencatat ketikan dan penyulap file foto
    handleSubmit   // Lonceng pengutus kurir ke pusat data server
  } = useModalPerbaruiEvent(event, refetch, showToast, onClose);

  // PENGAMAN MEJA: Jika tuas isOpen belum ditarik, meja formulir tetap tertutup tirai
  if (!isOpen) return null;

  return (
    // ─── TIRAI PENGABUR RUANG KERJA ──────────────────────────────────────────
    // Layar transparan gelap (z-50) yang melayang menutupi hamparan balai
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
          <h2 className="text-xl font-bold text-black">Perbarui Event</h2>
          
          {/* Tombol silang (X) di sudut kanan atas untuk menutup meja formulir */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* ─── HAMPARAN KERTAS ISIAN (BODY KONTEN) ──────────────────────────── */}
        {/* Batasan tinggi meja formulir (max-h-[70vh]) bersiap meluncur vertikal (overflow-y-auto) jika isian padat */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* 
            KERTAS INDUK FORMULIR:
            - id="edit-event-form": Tali pengikat sakti yang menghubungkan tombol Simpan di bawah meja dengan kertas ini.
            - onSubmit={handleSubmit}: Membunyikan lonceng kurir saat tombol Simpan ditekan.
          */}
          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* ─── LAJUR BARIS KEDUA (FOTO BARU & DESKRIPSI) ────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LACI PEMASUKAN FOTO BARU (OPSIONAL) */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Foto Event Baru (Opsional)</label>
                <div className="flex items-center gap-3">
                  
                  {/* Trik menyembunyikan laci file asli di balik plang tombol hitam elegan */}
                  <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                    Choose File
                    <input 
                      type="file" 
                      name="fotoBaru" // Ditambatkan pada laci 'fotoBaru'
                      onChange={handleChange} // Memanggil penyulap gambar
                      className="sr-only" // Menyembunyikan tombol bawaan browser yang usang
                    />
                  </label>
                  
                  {/* Papan tulisan penunjuk nama file yang berhasil disulap */}
                  <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                    {formData.fotoBaru ? (formData.fotoBaru.name || "Gambar Terpilih") : "No File Chosen"}
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
          {/* Tombol lonceng hijau besar pembawa formulir matang ke server */}
          <button 
            type="submit"
            form="edit-event-form" // Terikat erat pada tali id form di atas
            disabled={isSubmitting} // Terkunci erat selama kurir lari ke server
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#45a025] text-white"
            }`}
          >
            {/* Teks berganti menenangkan saat kurir berlari */}
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </div>
    </div>
  );
}
