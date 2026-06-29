import React from 'react';
// Mengimpor ikon silang penutup kotak (X)
import { X } from 'lucide-react';
// Mengimpor pengatur kotak tambah baru
import { useModalTambahKategori } from '../hooks/useModalTambahKategori';

/**
 * =========================================================================
 * KOTAK POP-UP TAMBAH KATEGORI (Ibarat Formulir Kategori Baru di Toko)
 * =========================================================================
 * File ini ibarat "Formulir Kategori Baru" dengan latar transparan buram.
 * Saat dibuka, admin disuguhkan dua kotak ketik kosong untuk mencatat nama
 * dan deskripsi kategori baru yang ingin ditambahkan ke toko.
 */
const ModalTambahKategori = ({ isOpen, onClose, refetch, showToast }) => {
  // 1. Meminta bantuan pengatur kotak tambah untuk mengelola kotak isian dan tombol simpan
  const {
    nama, setNama,
    deskripsi, setDeskripsi,
    isSubmitting,
    handleSave
  } = useModalTambahKategori(isOpen, refetch, showToast, onClose);

  // Jika pop-up tidak dibuka (isOpen = false), sembunyikan kotak ini
  if (!isOpen) return null;

  return (
    // Latar belakang transparan buram (blur) penutup layar utama
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm font-sans transition-opacity">
      {/* Kotak formulir putih anggun selebar 700px */}
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col">
        
        {/* --- BAGIAN ATAS (Header) --- */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tambah Kategori Produk</h2>
          {/* Tombol silang (X) penutup kotak pop-up */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* --- BAGIAN TENGAH: DUA KOTAK ISIAN (Body) --- */}
        <div className="p-8 flex flex-col md:flex-row gap-6">
          
          {/* Kotak 1: Kotak Ketik Nama Kategori */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-gray-800 mb-2 font-medium">Nama Kategori</label>
              <input
                type="text"
                placeholder="Nama Kategori"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="border border-gray-300 rounded p-3 outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>
          
          {/* Kotak 2: Kotak Isian Panjang Deskripsi Kategori */}
          <div className="flex-1 flex flex-col">
            <label className="text-gray-800 mb-2 font-medium">Deskripsi Kategori</label>
            <textarea
              placeholder="Deskripsi Kategori"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border border-gray-300 rounded p-3 h-full min-h-[8rem] outline-none focus:border-green-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* --- BAGIAN BAWAH: TOMBOL TAMBAH (Footer) --- */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          {/* Tombol tambah - Jika sistem sedang menyimpan, tombol terkunci sementara */}
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Kategori'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahKategori;
