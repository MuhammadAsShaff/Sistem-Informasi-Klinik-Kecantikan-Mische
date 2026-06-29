import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * PLANG PERINGATAN PEMUSNAHAN ANTREAN TAMU (ModalHapus)
 * Ibarat plang segel bersimbol seru (!) besar yang dipasang mandor di depan buku antrean.
 * Plang ini menanyakan ketegasan pimpinan: "Benarkah Anda ingin mencoret dan membuang tamu ini permanen?".
 * Jika menekan "Ya, Hapus", Petugas Pembersih (hook.handleDelete) langsung menunaikan tugasnya.
 */
export default function ModalHapus({ isOpen, onClose, hook }) {
  if (!isOpen) return null; // Jika saklar ditutup, plang segel ini disembunyikan

  // Meminta tombol eksekusi dan rambu sibuk dari Petugas Pembersih
  const { handleDelete, isDeleting } = hook;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* Simbol seru besar tanda peringatan krusial */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* Pertanyaan ketegasan */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus Reservasi ini?
        </h2>

        {/* Pilihan tindakan: Hapus atau Batalkan */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
        
      </div>
    </div>
  );
}
