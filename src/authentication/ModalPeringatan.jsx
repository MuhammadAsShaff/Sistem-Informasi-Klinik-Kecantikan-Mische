import React from "react";
import { AlertCircle } from "lucide-react";

export default function ModalPeringatan({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-[30px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center text-center">
          {/* ICON PERINGATAN */}
          <div className="text-red-500 mb-6">
            <AlertCircle size={100} strokeWidth={1.5} />
          </div>

          {/* TEKS PESAN */}
          <h2 className="text-[22px] font-medium text-[#4B5563] mb-10 leading-relaxed px-4">
            {message}
          </h2>

          {/* BUTTON */}
          <div className="flex items-center gap-4 w-full">
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
