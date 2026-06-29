import React from 'react';

/**
 * LEMARI ETALASE GALERI MADING (GaleriKegiatan)
 * Ibarat lemari kaca panjang di dinding mading klinik tempat memajang deretan foto kegiatan.
 * Lemari ini menyediakan tombol "Tambah" di bagian atas untuk mendaftarkan acara baru, 
 * serta memasang sepasang tombol "Perbarui" (pensil) dan "Hapus" (tong sampah) di bawah setiap foto.
 */
const GaleriKegiatan = ({ data = [], onTambahClick, onPerbaruiClick, onHapusClick }) => {
  return (
    <div className="border border-black p-6 rounded-none bg-transparent">
      {/* BAGIAN JUDUL DAN TOMBOL TAMBAH MADING */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[28px] font-semibold text-black mb-1">Galeri Kegiatan</h2>
          <p className="text-[13px] text-gray-800 font-medium">Kegiatan dan dokumentasi dari berbagai acara kami.</p>
        </div>
        <button onClick={onTambahClick} className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-medium">
          Tambah
        </button>
      </div>
      
      {/* RAK-RAK PAJANGAN FOTO KEGIATAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {data.map((item) => (
          <div key={item.idKegiatan || item.id} className="border border-black flex flex-col h-48 bg-transparent relative">
            {/* Bingkai foto utama */}
            <div className="flex-1 overflow-hidden flex items-center justify-center text-[13px] font-semibold">
              {item.foto ? (
                <img src={`http://127.0.0.1:8000/storage/${item.foto}`} alt={item.namaKegiatan} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">Foto Kegiatan</span>
              )}
            </div>
            
            {/* Papan nama kegiatan dan sepasang tombol tindakan */}
            <div className="px-4 pb-4">
              <div className="bg-[#1f2937] text-white text-[11px] px-3 py-1 w-max mb-0 border border-black border-b-0 max-w-full truncate">
                {item.namaKegiatan}
              </div>
              <div className="flex space-x-2 w-max">
                <button 
                  onClick={() => onPerbaruiClick(item.idKegiatan || item.id)} 
                  className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-medium"
                >
                  Perbarui
                </button>
                <button 
                  onClick={() => onHapusClick(item.idKegiatan || item.id)} 
                  className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-5 py-1.5 text-[13px] font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pesan sopan jika lemari etalase sedang kosong melompong */}
      {data.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Belum ada kegiatan yang ditambahkan.</p>
      )}
    </div>
  );
};

export default GaleriKegiatan;
