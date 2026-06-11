import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTambahKategori } from '../hooks/useTambahKategori';

const ModalTambahKategori = ({ isOpen, onClose, refetch, showToast }) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tambahKategori } = useTambahKategori(refetch);

  // Reset fields when opened
  React.useEffect(() => {
    if (isOpen) {
      setNama('');
      setDeskripsi('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!nama.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await tambahKategori({ nama, deskripsi });
    setIsSubmitting(false);

    if (result.success) {
      showToast(result.message, 'success');
      onClose();
    } else {
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm font-sans transition-opacity">
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tambah Kategori Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col md:flex-row gap-6">
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

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Kategori'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahKategori;
