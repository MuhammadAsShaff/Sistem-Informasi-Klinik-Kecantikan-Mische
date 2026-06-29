import React from 'react';
import { useModalHapusKategori } from '../hooks/useModalHapusKategori';

/**
 * =========================================================================
 * KOTAK POP-UP KONFIRMASI HAPUS (Ibarat Kotak Pertanyaan Sebelum Menghapus)
 * =========================================================================
 * File ini ibarat "Kotak Pertanyaan Pengaman" yang muncul saat tombol hapus ditekan.
 * Tujuannya memastikan admin tidak salah klik, dengan menampilkan ikon tanda seru (!)
 * dan tombol pilihan "Ya, Hapus" atau "Tidak, Batalkan".
 */
const ModalHapusKategori = ({ isOpen, onClose, dataId, refetch, showToast }) => {
  // Memanggil pengatur kotak hapus untuk memproses penghapusan
  const { isDeleting, handleDelete } = useModalHapusKategori(dataId, refetch, showToast, onClose);

  // Jika pop-up tidak sedang dibuka (isOpen = false), sembunyikan kotak ini
  if (!isOpen) return null;

  return (
    // Latar belakang hitam transparan yang menutupi halaman utama
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Kotak putih bersih di tengah layar dengan sudut tumpul */}
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* IKON TANDA SERU (!) */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* PERTANYAAN KONFIRMASI */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus Kategori ini?
        </h2>

        {/* DUA TOMBOL PILIHAN */}
        <div className="flex justify-center gap-4">
          {/* Tombol Hapus (Ya, Hapus) - Jika proses sedang berjalan, tombol terkunci */}
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className={`bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
          {/* Tombol Batal (Tidak, Batalkan) - Menutup pop-up tanpa menghapus apa pun */}
          <button 
            onClick={onClose}
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ModalHapusKategori;
