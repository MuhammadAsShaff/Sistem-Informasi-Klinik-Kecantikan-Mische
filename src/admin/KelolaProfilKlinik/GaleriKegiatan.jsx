import React from 'react';

const GaleriKegiatan = ({ onTambahClick, onPerbaruiClick, onHapusClick }) => {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="border border-black p-6 rounded-none bg-transparent">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[28px] font-semibold text-black mb-1">Galeri Kegiatan</h2>
          <p className="text-[13px] text-gray-800 font-medium">Kegiatan dan dokumentasi dari berbagai acara kami.</p>
        </div>
        <button onClick={onTambahClick} className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-medium">
          Tambah
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {items.map((item) => (
          <div key={item} className="border border-black flex flex-col h-48 bg-transparent relative">
            <div className="flex-1 flex items-center justify-center text-[13px] font-semibold">
              Foto
            </div>
            
            <div className="px-4 pb-4">
              <div className="bg-[#1f2937] text-white text-[11px] px-3 py-1 w-max mb-0 border border-black border-b-0">
                Deskripsi foto
              </div>
              <div className="flex space-x-2 w-max">
                <button 
                  onClick={() => onPerbaruiClick(item)} 
                  className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-medium"
                >
                  Perbarui
                </button>
                <button 
                  onClick={() => onHapusClick(item)} 
                  className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-5 py-1.5 text-[13px] font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriKegiatan;
