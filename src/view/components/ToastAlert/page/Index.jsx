import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useToastAlert } from '../hooks/useToastAlert';

export default function ToastAlert({ isOpen, message, type = 'success', onClose }) {
  useToastAlert(isOpen, onClose);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] rounded-[30px] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          {/* IKON BESAR */}
          <div className="mb-6">
            {isSuccess ? (
              <CheckCircle2 className="text-[#7CC052]" size={80} strokeWidth={1.5} />
            ) : (
              <XCircle className="text-red-500" size={80} strokeWidth={1.5} />
            )}
          </div>

          {/* TEKS PESAN */}
          <h2 className="text-xl font-bold text-[#4B5563] leading-relaxed">
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
}
