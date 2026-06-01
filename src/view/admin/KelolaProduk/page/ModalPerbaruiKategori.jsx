import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalPerbaruiKategori = ({ isOpen, onClose, categoryData, onSave }) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Update input fields when modal opens or categoryData changes
  useEffect(() => {
    if (categoryData) {
      setNama(categoryData.name || '');
      setDeskripsi(categoryData.description || '');
    } else {
      setNama('');
      setDeskripsi('');
    }
  }, [categoryData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (categoryData) {
      onSave(categoryData.id, { name: nama, description: deskripsi });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 font-sans">
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Perbarui Kategori Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <label className="text-gray-800 mb-2 font-medium">Nama Kategori</label>
            <input
              type="text"
              placeholder="Nama Kategori"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="border border-gray-300 rounded p-3 outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-gray-800 mb-2 font-medium">Deskripsi Kategori</label>
            <textarea
              placeholder="Deskripsi Kategori"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border border-gray-300 rounded p-3 h-32 outline-none focus:border-green-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors"
          >
            Simpan Kategori
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPerbaruiKategori;
