import React from "react";
import { Trash2 } from "lucide-react";

export default function ModalKonfirmasiHapus({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Apakah Anda yakin ingin menghapus produk ini dari keranjang?",
  title = "Hapus Data"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-[30px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center text-center">
          {/* ICON PERINGATAN */}
          <div className="text-red-500 mb-6 bg-red-50 p-4 rounded-full">
            <Trash2 size={80} strokeWidth={1.5} />
          </div>

          {/* TEKS KONFIRMASI */}
          <h2 className="text-[22px] font-medium text-[#4B5563] mb-10 leading-relaxed px-4">
            {message}
          </h2>

          {/* BUTTONS */}
          <div className="flex items-center gap-4 w-full">
            <button 
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-100"
            >
              Ya, Hapus
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              Batal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
