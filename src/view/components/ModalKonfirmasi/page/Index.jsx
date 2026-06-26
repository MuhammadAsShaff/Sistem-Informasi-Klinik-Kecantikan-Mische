import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ModalKonfirmasi({ isOpen, title, message, onConfirm, onClose, confirmText = "Ya, Lanjutkan", cancelText = "Batal", type = "warning" }) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[450px] rounded-[30px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center text-center">
          {/* ICON */}
          <div className={`${isDanger ? "text-red-500 bg-red-50" : "text-yellow-500 bg-yellow-50"} p-4 rounded-full mb-6`}>
            <AlertTriangle size={50} strokeWidth={1.5} />
          </div>

          {/* TITLE */}
          {title && (
            <h2 className="text-[22px] font-bold text-gray-800 mb-2">
              {title}
            </h2>
          )}

          {/* MESSAGE */}
          <p className="text-gray-500 mb-8 leading-relaxed px-2 text-sm">
            {message}
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              {cancelText}
            </button>
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
