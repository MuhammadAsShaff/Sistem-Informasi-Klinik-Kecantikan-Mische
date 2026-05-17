import React from "react";
import { AlertCircle } from "lucide-react";

const ModalHapusKegiatan = ({ isOpen, onClose, hook }) => {
  const { isLoading, handleDelete } = hook;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col text-center items-center">
          <div className="text-[#9DA3AE] mb-5"><AlertCircle size={70} strokeWidth={2} /></div>
          <h2 className="text-[17px] font-medium text-[#4B5563] mb-8 leading-relaxed px-2">
            Apakah Anda yakin ingin menghapus kegiatan ini beserta fotonya?
          </h2>
          <div className="flex items-center gap-3 w-full">
            <button onClick={handleDelete} disabled={isLoading}
              className={`flex-1 bg-[#55BC36] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#46a02b] transition-all shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isLoading ? "Menghapus..." : "Ya, Hapus"}
            </button>
            <button onClick={onClose} disabled={isLoading}
              className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              Tidak, Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalHapusKegiatan;
