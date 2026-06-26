import React from 'react';
import { X } from 'lucide-react';
import { useModalResi } from '../hooks/useModalResi';

const ModalResi = ({ isOpen, onClose, data, onSave }) => {
  const { nomorResi, setNomorResi, isSubmitting, handleSubmit } = useModalResi(data, onSave);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden font-sans">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Update Nomor Resi</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">No. Invoice</label>
              <div className="text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {data.invoiceNumber || '-'}
              </div>
            </div>

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
            
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs">
              Menyimpan nomor resi akan secara otomatis mengubah status pesanan menjadi <strong>Dikirim</strong> (jika belum Selesai).
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !nomorResi.trim()}
              className="px-6 py-2 bg-[#56BC36] text-white font-medium rounded-lg hover:bg-[#469e2c] transition-colors disabled:opacity-50"
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
