import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Modal konfirmasi hapus jadwal.
 * Logic delete dikelola oleh hook `useHapusJadwal` yang dipass lewat prop `hook`.
 */
export default function ModalHapusJadwal({ isOpen, onClose, hook }) {
  const { isLoading, confirmDelete } = hook;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* Warning Icon */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* Title */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus Jadwal ini?
        </h2>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={confirmDelete}
            disabled={isLoading}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
        
      </div>
    </div>
  );
}
