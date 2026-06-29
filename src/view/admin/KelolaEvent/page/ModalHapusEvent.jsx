import React from 'react';
// Mengimpor Mandor Kebersihan (useHapusEvent) pengeksekusi penghancuran arsip di server
import { useHapusEvent } from '../hooks/useHapusEvent';

/**
 * =========================================================================
 * PETUGAS KONFIRMASI PENGHANCURAN ARSIP (ModalHapusEvent)
 * =========================================================================
 * Ibarat seorang petugas disiplin yang menahan tangan Anda saat hendak
 * membuang arsip event ke mesin penghancur kertas. Petugas ini mengangkat
 * papan tanda seru (!) dan menanyakan kepastian: "Apakah Anda benar-benar yakin
 * ingin menghapus event ini?"
 */
export default function ModalHapusEvent({ isOpen, onClose, refetch, showToast, event }) {
  // ─── MENGHUBUNGKAN DENGAN MANDOR KEBERSIHAN ──────────────────────────────
  // Menitipkan lonceng penyegar (refetch) kepada Mandor Kebersihan (useHapusEvent)
  const { hapusEvent } = useHapusEvent(refetch);

  // PENGAMAN MEJA: Jika tuas isOpen belum ditarik, petugas disiplin tetap bersembunyi di balik tirai
  if (!isOpen) return null;

  /**
   * ─── TUGAS MEMBUNYIKAN LONCENG PENGHANCURAN (handleHapus) ──────────────────
   * Dipicu saat admin mantap menekan tombol 'Ya, Hapus'.
   */
  const handleHapus = async () => {
    // Memastikan map arsip event nyata-nyata ada di tangan
    if (event) {
      // Mengidentifikasi nomor KTP (ID) arsip event tersebut
      const id = event.id || event.idEvent;
      
      // Memerintahkan Mandor Kebersihan mengeksekusi penghancuran arsip di server
      const result = await hapusEvent(id);
      
      // Membaca laporan hasil kerja Mandor Kebersihan
      if (result.success) {
        // Jika sukses: Kibarkan plang kilat hijau dan suruh petugas disiplin pergi (onClose)
        showToast("Berhasil menghapus event");
        onClose();
      } else {
        // Jika gagal: Kibarkan plang kilat merah berisi teguran dari server
        showToast(result.message, "error");
      }
    }
  };

  return (
    // ─── TIRAI PENGABUR RUANG KERJA ──────────────────────────────────────────
    // Layar gelap transparan (bg-black/50) yang melayang menutupi pekarangan balai (z-50)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* ─── PAPAN PERINGATAN MARMER ────────────────────────────────────────── */}
      {/* Papan marmer putih berfondasi kukuh (max-w-md) bersudut bundar (rounded-2xl) */}
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* ─── BENDERA IKON TANDA SERU (!) ──────────────────────────────────── */}
        {/* Bingkai bundar abu-abu tebal (border-4) lambang peringatan serius */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* ─── KALIMAT PERTANYAAN DISIPLIN ──────────────────────────────────── */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus event ini?
        </h2>

        {/* ─── MEJA DUA TUAS KEPUTUSAN ──────────────────────────────────────── */}
        <div className="flex justify-center gap-4">
          
          {/* Tuas Hijau Eksekusi Hapus: Membunyikan lonceng handleHapus */}
          <button 
            onClick={handleHapus}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Ya, Hapus
          </button>
          
          {/* Tuas Putih Pembatalan: Membunyikan lonceng onClose untuk menyuruh petugas pergi tanpa merusak arsip */}
          <button 
            onClick={onClose}
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>

        </div>
        
      </div>
    </div>
  );
}
