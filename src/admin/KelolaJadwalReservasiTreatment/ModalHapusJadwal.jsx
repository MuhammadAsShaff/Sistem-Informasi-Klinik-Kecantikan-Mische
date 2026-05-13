import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";

export default function ModalHapusJadwal({ isOpen, onClose, jadwalData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://127.0.0.1:8000/api/admin/schedules/${jadwalData.idJadwal || jadwalData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Error delete schedule:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Gagal menghapus jadwal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-[30px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center text-center">
          <div className="text-[#9CA3AF] mb-6">
            <AlertCircle size={100} strokeWidth={1.5} />
          </div>

          <h2 className="text-[22px] font-medium text-[#4B5563] mb-10 leading-relaxed px-4">
            Apakah Anda yakin ingin menghapus Jadwal ini?
          </h2>

          <div className="flex items-center gap-4 w-full">
            <button 
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 bg-[#7CC052] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#68a741] transition-all shadow-lg shadow-green-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              Tidak, Batalkan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
