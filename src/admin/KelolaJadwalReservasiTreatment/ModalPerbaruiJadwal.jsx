import React from "react";
import { X } from "lucide-react";

export default function ModalPerbaruiJadwal({ isOpen, onClose, jadwalData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* HEADER MODAL */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui Jadwal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="px-10 py-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
            
            {/* Jam Mulai */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Jam Mulai</label>
              <input 
                type="time" 
                defaultValue={jadwalData?.jamMulai}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all"
              />
            </div>

            {/* Jam Selesai */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Jam Selesai</label>
              <input 
                type="time" 
                defaultValue={jadwalData?.jamSelesai}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all"
              />
            </div>

          </div>

          {/* FOOTER ACTION */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button className="bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100">
              Perbarui Jadwal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
