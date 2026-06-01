import React from "react";

const ModalHapus = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-poppins">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mb-4 rounded-full border-[6px] border-gray-400 flex items-center justify-center text-gray-400">
          <span className="text-5xl font-bold mb-2">!</span>
        </div>
        
        <h2 className="text-xl font-medium text-gray-700 mb-8">
          Apakah Anda yakin ingin menghapus Testimoni ini?
        </h2>
        
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onDelete}
            className="px-6 py-2.5 bg-[#56BC36] hover:bg-[#469e2c] text-white rounded-lg font-medium transition-colors"
          >
            Ya, Hapus
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHapus;
