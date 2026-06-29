import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * =========================================================================
 * PLANG PENGUMUMAN PERINGATAN TUNGGAL (ModalPeringatan)
 * =========================================================================
 * Ibarat seorang petugas pembawa plang maklumat yang berdiri tegap di tengah
 * ruangan. Petugas ini tidak meminta Anda memilih, melainkan hanya menyampaikan
 * satu pesan penting (misalnya: "Stok Habis!" atau "Fitur Dikunci!"), lalu 
 * menyediakan satu tombol tunggal "Mengerti" sebagai bukti Anda telah membacanya.
 */
export default function ModalPeringatan({ isOpen, message, onClose }) {
  // Jika tuas isOpen belum ditarik, petugas maklumat tetap berdiam di dalam laci
  if (!isOpen) return null;

  return (
    // ─── TIRAI PENGABUR KELILING ─────────────────────────────────────────────
    // Tirai gelap transparan (bg-black/40) yang meredupkan hamparan balai di belakangnya
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      
      {/* ─── PAPAN MAKLUMAT MARMER ──────────────────────────────────────────── */}
      {/* Papan marmer putih melengkung (rounded-[30px]) yang mengembang seketika (zoom-in) */}
      <div className="bg-white w-full max-w-[500px] rounded-[30px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Wadah penyusun ikon, pesan, dan tombol agar tertata rapi di tengah (text-center) */}
        <div className="flex flex-col items-center text-center">
          
          {/* ─── IKON PERINGATAN MERAH DARURAT ──────────────────────────────── */}
          {/* Ikon tanda seru merah besar sebagai daya tarik pandangan */}
          <div className="text-red-500 mb-6">
            <AlertCircle size={100} strokeWidth={1.5} />
          </div>

          {/* ─── KALIMAT MAKLUMAT UTAMA ─────────────────────────────────────── */}
          {/* Tulisan pesan peringatan tebal yang harus dicerna oleh tamu */}
          <h2 className="text-[22px] font-medium text-[#4B5563] mb-10 leading-relaxed px-4">
            {message}
          </h2>

          {/* ─── TOMBOL TUNGGAL TANDA MENGERTI ──────────────────────────────── */}
          {/* Meja penyangga tombol persetujuan tunggal */}
          <div className="flex items-center gap-4 w-full">
            {/* Tombol hijau besar yang jika ditekan akan membunyikan lonceng onClose untuk menidurkan petugas */}
            <button 
              onClick={onClose}
              className="w-full bg-[#7CC052] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#68a741] transition-all shadow-lg shadow-green-100"
            >
              Mengerti
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}

