import React from 'react';
// Mengimpor ikon silang untuk menutup kotak pop-up (X)
import { X } from 'lucide-react';
// Mengimpor asisten pengatur isian nomor resi
import { useModalResi } from '../hooks/useModalResi';

/**
 * =========================================================================
 * KOTAK POP-UP ISI NOMOR RESI (Ibarat Formulir Resi Pengiriman)
 * =========================================================================
 * Ini adalah kotak pop-up (jendela kecil) yang muncul saat admin menekan ikon truk.
 * Di sini admin bisa memasukkan atau mengubah nomor resi pengiriman kurir.
 * Terdapat pemberitahuan biru bahwa menyimpan nomor resi akan otomatis mengubah
 * status pesanan tersebut menjadi "Dikirim" di sistem.
 */
const ModalResi = ({ isOpen, onClose, data, onSave }) => {
  // 1. Memanggil asisten untuk menyimpan teks resi dan fungsi pengiriman data
  const { nomorResi, setNomorResi, isSubmitting, handleSubmit } = useModalResi(data, onSave);

  // Jika pop-up tidak sedang dibuka, jangan tampilkan apa-apa
  if (!isOpen) return null;

  return (
    // Latar belakang gelap transparan di belakang kotak pop-up
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      {/* Kotak putih utama formulir resi */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden font-sans">
        
        {/* --- BAGIAN ATAS KOTAK (Judul & Tombol Tutup) --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Update Nomor Resi</h3>
          {/* Tombol silang untuk menutup pop-up */}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* --- FORMULIR ISIAN NOMOR RESI --- */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            {/* Menampilkan Nomor Invoice */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">No. Invoice</label>
              <div className="text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {data.invoiceNumber || '-'}
              </div>
            </div>

            {/* Kotak Ketik untuk Mengisi Nomor Resi (Wajib Diisi / required) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Resi <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={nomorResi}
                onChange={(e) => setNomorResi(e.target.value)}
                placeholder="Masukkan nomor resi..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
              />
            </div>
            
            {/* KOTAK PEMBERITAHUAN BIRU */}
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs">
              Menyimpan nomor resi akan secara otomatis mengubah status pesanan menjadi <strong>Dikirim</strong> (jika belum Selesai).
            </div>
          </div>

          {/* --- BAGIAN BAWAH KOTAK (Tombol Batal & Simpan) --- */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            {/* Tombol Batal */}
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            {/* Tombol Simpan Resi (Akan terkunci jika masih kosong atau sedang diproses) */}
            <button 
              type="submit"
              disabled={isSubmitting || !nomorResi.trim()}
              className="px-6 py-2 bg-[#56BC36] text-white font-medium rounded-lg hover:bg-[#469e2c] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Resi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalResi;
