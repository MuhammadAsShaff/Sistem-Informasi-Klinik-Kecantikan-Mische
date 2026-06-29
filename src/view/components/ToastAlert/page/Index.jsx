import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useToastAlert } from '../hooks/useToastAlert';

/**
 * =========================================================================
 * PAPAN PLANG NOTIFIKASI KILAT (ToastAlert)
 * =========================================================================
 * Ibarat seorang asisten cilik pembawa papan pengumuman kilat yang melompat
 * ke hadapan Anda saat ada kabar gembira (sukses) atau teguran (error).
 * Asisten ini tidak berlama-lama; ia ditemani oleh pemegang stopwatch (useToastAlert)
 * yang akan menyuruhnya bersembunyi kembali dalam hitungan sekejap mata.
 */
export default function ToastAlert({ isOpen, message, type = 'success', onClose }) {
  // Mengutus asisten stopwatch (useToastAlert) untuk menghitung waktu tayang plang
  useToastAlert(isOpen, onClose);

  // Jika tuas isOpen belum ditarik, asisten cilik tetap meringkuk di bawah meja (tidak merender)
  if (!isOpen) return null;

  // Menyelidiki apakah kabar yang dibawa adalah kabar gembira (success) atau kabar buruk (error)
  const isSuccess = type === 'success';

  return (
    // ─── LAYAR TRANSPARAN PENGHALANG BALAI ───────────────────────────────────
    // Tirai tipis berbayang (bg-black/30) yang mengaburkan balai di sekelilingnya (z-[9999])
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* ─── PAPAN PENGUMUMAN MARMER KILAT ──────────────────────────────────── */}
      {/* Papan marmer putih bersudut lengkung (rounded-[30px]) yang melompat cepat (zoom-in) */}
      <div className="bg-white w-full max-w-[400px] rounded-[30px] p-10 shadow-2xl animate-in zoom-in duration-300">
        
        {/* Wadah penyelarasan ikon dan tulisan agar persis berada di tengah mimbar (text-center) */}
        <div className="flex flex-col items-center text-center">
          
          {/* ─── BENDERA IKON SUKSES / GAGAL ────────────────────────────────── */}
          {/* Penempatan patung ikon besar */}
          <div className="mb-6">
            {/* Jika kabar gembira, pajang patung centang hijau. Jika kabar buruk, pajang patung silang merah */}
            {isSuccess ? (
              <CheckCircle2 className="text-[#7CC052]" size={80} strokeWidth={1.5} />
            ) : (
              <XCircle className="text-red-500" size={80} strokeWidth={1.5} />
            )}
          </div>

          {/* ─── KALIMAT KABAR BERITA ───────────────────────────────────────── */}
          {/* Ukiran teks berita utama yang ditebalkan (font-bold) */}
          <h2 className="text-xl font-bold text-[#4B5563] leading-relaxed">
            {message}
          </h2>

        </div>
      </div>

    </div>
  );
}

