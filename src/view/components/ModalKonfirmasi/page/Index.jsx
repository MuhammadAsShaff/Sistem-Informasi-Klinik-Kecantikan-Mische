import React from "react";
import { AlertTriangle } from "lucide-react";

/**
 * =========================================================================
 * PLANG DISIPLIN PERMINTAAN KEPUTUSAN (ModalKonfirmasi)
 * =========================================================================
 * Ibarat petugas berompi kuning atau merah yang tiba-tiba melangkah ke depan meja Anda,
 * mengangkat papan tanda seru, dan meminta Anda mengambil keputusan penting
 * (misalnya: "Lanjutkan" atau "Batalkan"). Plang ini siap mengaburkan suasana
 * latar belakang agar Anda fokus pada keputusan tersebut.
 */
export default function ModalKonfirmasi({ isOpen, title, message, onConfirm, onClose, confirmText = "Ya, Lanjutkan", cancelText = "Batal", type = "warning" }) {
  // Jika tuas isOpen belum ditarik, petugas berompi tetap bersembunyi di balik tirai
  if (!isOpen) return null;

  // Menyelidiki apakah status plang ini darurat tingkat tinggi (merah/danger) atau sekadar peringatan (kuning/warning)
  const isDanger = type === "danger";

  return (
    // ─── TIRAI PENGABUR RUANG KERJA ──────────────────────────────────────────
    // Layar transparan gelap (bg-black/40) yang membekukan aktivitas di belakangnya
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      
      {/* ─── PAPAN PLANG KEPUTUSAN UTAMA ────────────────────────────────────── */}
      {/* Papan marmer putih bersudut bundar (rounded-[30px]) yang melompat ke hadapan Anda */}
      <div className="bg-white w-full max-w-[450px] rounded-[30px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Wadah penyelarasan teks dan tuas agar seimbang di tengah balai (text-center) */}
        <div className="flex flex-col items-center text-center">
          
          {/* ─── IKON BENDERA PERINGATAN ────────────────────────────────────── */}
          {/* Wadah ikon bundar: Berbalut cat merah jika darurat (danger), berbalut cat kuning jika peringatan (warning) */}
          <div className={`${isDanger ? "text-red-500 bg-red-50" : "text-yellow-500 bg-yellow-50"} p-4 rounded-full mb-6`}>
            <AlertTriangle size={50} strokeWidth={1.5} />
          </div>

          {/* ─── JUDUL PERINGATAN (JIKA ADA) ────────────────────────────────── */}
          {/* Judul tebal pengumuman di bagian atas papan */}
          {title && (
            <h2 className="text-[22px] font-bold text-gray-800 mb-2">
              {title}
            </h2>
          )}

          {/* ─── TEKS MASALAH / PERTANYAAN UTAMA ────────────────────────────── */}
          {/* Penjelasan mendetail mengenai keputusan apa yang harus Anda ambil */}
          <p className="text-gray-500 mb-8 leading-relaxed px-2 text-sm">
            {message}
          </p>

          {/* ─── DUA TUAS PEMILIHAN KEPUTUSAN ───────────────────────────────── */}
          {/* Rak mendatar tempat menyematkan tuas pembatalan dan tuas kelanjutan */}
          <div className="flex items-center gap-3 w-full">
            
            {/* Tuas abu-abu pembatalan: Menutup plang tanpa mengubah apapun (onClose) */}
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              {cancelText}
            </button>
            
            {/* Tuas eksekusi: Mengandung warna merah (jika bahaya) atau hijau (jika aman), membunyikan lonceng onConfirm */}
            <button 
              onClick={onConfirm}
              className={`flex-1 text-white py-3 rounded-xl font-bold transition-all shadow-lg ${
                isDanger 
                  ? "bg-red-500 hover:bg-red-600 shadow-red-100" 
                  : "bg-[#56BC36] hover:bg-[#4ba82c] shadow-green-100"
              }`}
            >
              {confirmText}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

