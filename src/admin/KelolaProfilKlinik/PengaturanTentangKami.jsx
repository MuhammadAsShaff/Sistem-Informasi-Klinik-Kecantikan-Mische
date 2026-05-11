import React from 'react';

const PengaturanTentangKami = ({ onHapusClick }) => {
  return (
    <div className="border border-black p-6 mb-6 rounded-none bg-transparent">
      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-black mb-1">Deskripsi Klinik</label>
        <input type="text" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Visi Klinik</label>
          <input type="text" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Misi Klinik</label>
          <input type="text" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Buka</label>
          <input type="text" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Tutup</label>
          <input type="text" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="w-36 h-24 border border-black flex items-center justify-center text-[13px] font-semibold mb-2 bg-transparent">
          Foto Perusahaan
        </div>
        <div className="flex items-center">
          <button className="bg-[#1f2937] text-white px-3 py-1.5 text-xs font-medium border border-black border-r-0">Choose File</button>
          <span className="text-xs text-gray-800 font-medium ml-3">No File Choosen</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 w-max">
        <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-medium">Perbarui</button>
        <button onClick={onHapusClick} className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-5 py-1.5 text-[13px] font-medium">Hapus</button>
      </div>
    </div>
  );
};

export default PengaturanTentangKami;
