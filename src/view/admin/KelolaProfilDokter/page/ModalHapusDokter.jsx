import React from "react";
import { AlertCircle } from "lucide-react";

export default function ModalHapusDokter({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-5 border border-slate-200">
          <AlertCircle size={36} className="text-[#94A3B8]" />
        </div>

        {/* Message */}
        <h3 className="text-[#475569] text-base font-bold mb-8 max-w-[320px]">
          Apakah Anda yakin ingin menghapus Profil ini?
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#56BC36] hover:bg-[#469e2c] text-white py-3 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-50 text-black border border-gray-200 py-3 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tidak, Batalkan
          </button>
        </div>

      </div>
    </div>
  );
}
