import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * PLANG PERINGATAN PEMUSNAHAN PROMO (ModalHapusPromo)
 * Ibarat plang segel bersimbol seru (!) besar yang dipasang mandor di depan meja arsip.
 * Plang ini menanyakan ketegasan admin: "Benarkah Anda ingin merobek dan membuang promo ini permanen?".
 * Jika admin menekan "Ya, Hapus", Petugas Pemusnah (onConfirm) langsung menunaikan tugasnya.
 */
export default function ModalHapusPromo({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null; // Jika saklar ditutup, plang segel ini disembunyikan

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* Simbol seru besar tanda peringatan krusial */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* Pertanyaan ketegasan */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus promo ini?
        </h2>

        {/* Pilihan tindakan: Hapus atau Batalkan */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={onConfirm}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Ya, Hapus
          </button>
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
