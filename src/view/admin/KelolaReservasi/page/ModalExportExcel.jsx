import React from 'react';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import { useExportExcel } from '../hooks/useExportExcel';

/**
 * =========================================================================
 * MEJA KERJA REKAPITULASI BUKU EXCEL (ModalExportExcel)
 * =========================================================================
 * Ibarat meja kerja khusus tempat pimpinan memilih rentang waktu kunjungan tamu 
 * yang ingin dicetak menjadi buku besar Excel.
 * Di atas meja ini terdapat laci pemilihan jenis perawatan, kalender tanggal mulai, dan kalender tanggal selesai.
 * Segala urusan pencetakan dan kurir file biner dikerjakan oleh Asisten Perekap (useExportExcel).
 */
export default function ModalExportExcel({ isOpen, onClose }) {
  // Meminta laci isian, kalender, dan mesin pencetak dari Asisten Perekap Excel
  const {
    jenisTreatment, setJenisTreatment,
    tanggalMulai, setTanggalMulai,
    tanggalSelesai, setTanggalSelesai,
    isExporting,
    toast, setToast,
    handleExport
  } = useExportExcel(onClose);

  if (!isOpen) return null; // Jika saklar ditutup, meja kerja rekap ini dilipat kembali

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 font-poppins">
        
        {/* Atap Meja Rekapitulasi */}
        <div className="px-8 py-5 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-[22px] font-bold text-black">Export Excel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Ruangan Formulir Meja Kerja */}
        <div className="p-8">
          <div className="space-y-6">
            
            {/* BARIS 1: Laci Pemilihan Jenis Perawatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Jenis Treatment</label>
                <select
                  value={jenisTreatment}
                  onChange={(e) => setJenisTreatment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                >
                  <option value="semua">Semua Treatment</option>
                  <option value="Acne Treatment">Acne Treatment</option>
                  <option value="Facial Rejuvenation">Facial Rejuvenation</option>
                  <option value="Laser Therapy">Laser Therapy</option>
                  <option value="Brightening Therapy">Brightening Therapy</option>
                </select>
              </div>
            </div>

            {/* BARIS 2: Kotak Kalender Tanggal Mulai & Tanggal Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laci Tombol Cetak Buku */}
        <div className="px-8 py-5 border-t border-gray-300 flex justify-end mt-4">
          <button 
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 text-white font-medium rounded-md bg-[#56BC36] hover:bg-[#469e2c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Mengekspor...' : 'Export To Excel'}
          </button>
        </div>

      </div>
      <ToastAlert 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </div>
  );
}
