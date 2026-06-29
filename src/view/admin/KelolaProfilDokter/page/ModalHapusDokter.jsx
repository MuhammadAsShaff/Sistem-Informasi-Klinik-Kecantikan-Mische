import React from "react";

/**
 * TANDA PERINGATAN PENCABUTAN DOKTER (ModalHapusDokter)
 * Ibarat plang peringatan berseru (!) yang muncul di depan petugas sebelum mencabut nama dokter 
 * secara permanen dari rumah sakit. Plang ini menyodorkan dua pilihan tegas: "Ya, Hapus" 
 * untuk melanjutkan, atau "Tidak, Batalkan" untuk membatalkan tindakan.
 */
export default function ModalHapusDokter({ isOpen, onClose, onConfirm }) {
  // Jika saklar peringatannya mati, plang ini tetap tersembunyi
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* Lingkaran Simbol Tanda Seru (!) */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* Tulisan Pertanyaan Penentu */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus Profil ini?
        </h2>

        {/* Tombol-tombol Penentuan Sikap */}
        <div className="flex justify-center gap-4">
          {/* Tombol Hijau Setuju Hapus */}
          <button 
            onClick={onConfirm}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Ya, Hapus
          </button>
          
          {/* Tombol Putih Batal */}
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
}
