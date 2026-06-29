import React from "react";
import { LogOut } from "lucide-react";

/**
 * =========================================================================
 * PLANG PERINGATAN PINTU KELUAR (ModalKonfirmasiLogout)
 * =========================================================================
 * Ibarat seorang petugas keamanan yang menahan pintu saat Anda hendak pulang,
 * lalu menanyakan dengan tegas: "Apakah Anda benar-benar yakin ingin keluar
 * dari kantor ini sekarang?" untuk mencegah Anda tidak sengaja memencet tombol pulang.
 */
export default function ModalKonfirmasiLogout({ isOpen, onClose, onConfirm }) {
  // Jika tuas isOpen belum ditarik, petugas keamanan tetap tertidur lelap (tidak merender apapun)
  if (!isOpen) return null;

  return (
    // ─── LAYAR TIRAI PENGABUR KANTOR ─────────────────────────────────────────
    // Tirai hitam transparan (bg-black/40) yang melayang menutupi seluruh ruang kerja (z-[999])
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      
      {/* ─── PAPAN PLANG UTAMA ──────────────────────────────────────────────── */}
      {/* Papan plang marmer putih melengkung (rounded-[30px]) yang melompat seketika (zoom-in) */}
      <div className="bg-white w-full max-w-[500px] rounded-[30px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Kerangka penyeimbang teks dan tombol agar terpusat rapi (text-center) */}
        <div className="flex flex-col items-center text-center">
          
          {/* ─── IKON PERINGATAN MERAH ──────────────────────────────────────── */}
          {/* Lambang pintu keluar berwarna merah tanda peringatan serius */}
          <div className="text-red-500 mb-6">
            <LogOut size={100} strokeWidth={1.5} />
          </div>

          {/* ─── KALIMAT PERTANYAAN DISIPLIN ────────────────────────────────── */}
          {/* Pertanyaan tegas dari petugas keamanan */}
          <h2 className="text-[22px] font-medium text-[#4B5563] mb-10 leading-relaxed px-4">
            Apakah Anda yakin ingin keluar dari akun ini?
          </h2>

          {/* ─── DUA TUAS KEPUTUSAN ─────────────────────────────────────────── */}
          {/* Meja pembatas tempat meletakkan tuas merah (pulang) dan tuas putih (batal) */}
          <div className="flex items-center gap-4 w-full">
            
            {/* Tuas merah eksekusi pulang: Membunyikan lonceng onConfirm */}
            <button 
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-100"
            >
              Ya, Keluar
            </button>
            
            {/* Tuas putih urung pulang: Membunyikan lonceng onClose untuk menidurkan petugas */}
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              Batalkan
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

