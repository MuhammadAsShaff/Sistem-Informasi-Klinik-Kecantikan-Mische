import React, { useState } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';
import ToastAlert from '@/view/components/ToastAlert';

export default function ModalExportExcel({ isOpen, onClose }) {
  const [jenisTreatment, setJenisTreatment] = useState('semua');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await axiosClient.get(endpoints.admin.report.reservasi, {
        params: {
          jenisTreatment: jenisTreatment === 'semua' ? '' : jenisTreatment,
          tanggalMulai,
          tanggalSelesai
        },
        responseType: 'blob' // Penting untuk file biner
      });

      // Buat URL dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Ekstrak nama file dari header Content-Disposition jika ada (opsional), 
      // tapi kita set manual aja sesuai default nama file
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Laporan_Reservasi_${dateStr}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose(); // Tutup modal setelah export
    } catch (error) {
      console.error("Gagal melakukan export excel:", error);
      setToast({ isOpen: true, message: "Terjadi kesalahan saat mengunduh file Excel.", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 font-poppins">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-[22px] font-bold text-black">Export Excel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="space-y-6">
            
            {/* ROW 1 */}
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

            {/* ROW 2 */}
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

        {/* Footer */}
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
