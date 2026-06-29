import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * =========================================================================
 * KOTAK POP-UP KONFIRMASI HAPUS (Ibarat Kotak Pertanyaan Sebelum Menghapus)
 * =========================================================================
 * File ini ibarat "Kotak Pertanyaan Pengaman" yang muncul saat tombol hapus ditekan.
 * Tujuannya memastikan admin tidak salah klik dan menghapus jadwal secara tidak sengaja.
 * Kotak ini menampilkan ikon tanda seru (!) dan tombol "Ya, Hapus" atau "Tidak, Batalkan".
 */
export default function ModalHapusJadwal({ isOpen, onClose, hook }) {
  // Meminta bantuan pengatur hapus untuk mengambil penanda loading (isLoading) dan perintah hapus (confirmDelete)
  const { isLoading, confirmDelete } = hook;

  // Jika pop-up tidak sedang dibuka (isOpen = false), sembunyikan kotak ini
  if (!isOpen) return null;

  return (
    /*
      LATAR BELAKANG HITAM TRANSPARAN (fixed inset-0 z-50 bg-black/50):
      Menutupi layar utama di belakangnya agar admin fokus pada kotak konfirmasi di tengah layar.
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* KOTAK KONFIRMASI PUTIH BERSIH DENGAN SUDUT MELENGKUNG (rounded-2xl) */}
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* IKON TANDA SERU (!): Ikon lingkaran dengan tanda seru di tengahnya */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* PERTANYAAN KONFIRMASI (Title) */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          Apakah Anda yakin ingin menghapus Jadwal ini?
        </h2>

        {/* DUA TOMBOL PILIHAN (Actions) */}
        <div className="flex justify-center gap-4">
          
          {/* TOMBOL HAPUS (Ya, Hapus): Jika ditekan, jalankan perintah `confirmDelete` */}
          <button 
            onClick={confirmDelete}
            disabled={isLoading} // Jika sistem sedang menghapus, tombol ini terkunci sementara
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
          
          {/* TOMBOL BATAL (Tidak, Batalkan): Jika ditekan, tutup pop-up tanpa menghapus apa pun (`onClose`) */}
          <button 
            onClick={onClose}
            disabled={isLoading} // Jika sistem sedang sibuk, tombol batal juga terkunci
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
        
      </div>
    </div>
  );
}
