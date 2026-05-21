import React from "react";
import { AlertCircle } from "lucide-react";

export default function ModalHapusPromo({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-gray-500" />
        </div>

        {/* Text */}
        <h2 className="text-[22px] font-medium text-gray-600 mb-8 px-4">
          Apakah Anda yakin ingin menghapus promo ini?
        </h2>

        {/* Buttons */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-[#56BC36] hover:bg-[#4ea830] text-white font-medium rounded-xl transition-all active:scale-95 min-w-[140px]"
          >
            Ya, Hapus
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-black font-medium rounded-xl transition-all active:scale-95 min-w-[140px]"
          >
            Tidak, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
