import React from 'react';
import { AlertCircle } from 'lucide-react';

const ModalHapusKategori = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 font-sans">
      <div className="bg-white rounded-2xl w-[550px] max-w-[95%] p-10 shadow-xl flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 mt-4">
          <div className="w-24 h-24 rounded-full border-[6px] border-gray-400 flex items-center justify-center">
            <span className="text-gray-400 text-6xl font-bold pb-2">!</span>
          </div>
        </div>
        
        {/* Text */}
        <h2 className="text-2xl md:text-3xl font-medium text-gray-600 mb-10">
          Apakah Anda yakin ingin menghapus Kategori ini?
        </h2>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onConfirm}
            className="bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-8 py-3 rounded-lg shadow-sm transition-colors text-lg"
          >
            Ya, Hapus
          </button>
          <button 
            onClick={onClose}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium px-8 py-3 rounded-lg shadow-sm transition-colors text-lg"
          >
            Tidak, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHapusKategori;
