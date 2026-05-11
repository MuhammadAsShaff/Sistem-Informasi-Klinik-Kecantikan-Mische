import React from 'react';
import { X } from 'lucide-react';

const ModalEditKegiatan = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[750px] rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-[20px] font-bold text-black">Perbarui Kegiatan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-12 gap-8">
          
          {/* LEFT SIDE (Image) */}
          <div className="col-span-5 flex flex-col">
            <div className="border border-black h-[180px] w-full flex items-center justify-center text-[15px] font-semibold mb-4 bg-transparent">
              Foto Kegiatan
            </div>
            
            <p className="text-[13px] text-gray-800 text-center mb-4">Ubah Gambar Kegiatan</p>
            
            <div className="flex items-center justify-center">
              <button className="bg-[#1f2937] hover:bg-gray-800 text-white px-4 py-2 text-xs font-medium rounded-md shadow-sm">
                Choose File
              </button>
              <span className="text-xs text-black font-medium ml-3">No File Choosen</span>
            </div>
          </div>

          {/* RIGHT SIDE (Form) */}
          <div className="col-span-7 flex flex-col">
            <p className="text-[13px] text-gray-800 mb-6 leading-relaxed">
              Anda dapat menambahkan kegiatan baru dengan nama, deskripsi, dan gambar. Pastikan untuk memasukkan informasi terbaru agar data selalu akurat.
            </p>

            <div className="mb-4">
              <label className="block text-[14px] text-black mb-2">Nama Kegiatan</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white" 
                placeholder="Nama Kegiatan" 
              />
            </div>

            <div className="mb-2">
              <label className="block text-[14px] text-black mb-2">Deskripsi Kegiatan</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white min-h-[100px] resize-none" 
                placeholder="Deskripsi Kegiatan" 
              ></textarea>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            className="bg-[#55BC36] hover:bg-[#46a02b] text-white px-6 py-2.5 rounded-md font-medium text-[14px] transition-colors shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalEditKegiatan;
