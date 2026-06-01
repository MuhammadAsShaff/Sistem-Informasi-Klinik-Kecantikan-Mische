import React, { useState } from 'react';
import { X } from 'lucide-react';

const ModalTambahKategori = ({ isOpen, onClose, onSave }) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [image, setImage] = useState(null);

  // Reset fields when opened
  React.useEffect(() => {
    if (isOpen) {
      setNama('');
      setDeskripsi('');
      setImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (nama.trim() !== '') {
      onSave({ name: nama, description: deskripsi, image: image });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 font-sans">
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
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
            <div className="flex flex-col">
              <label className="text-gray-800 mb-2 font-medium">Gambar Kategori</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="border border-gray-300 rounded p-2.5 outline-none focus:border-green-500 transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
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
            className="bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors"
          >
            Tambah Kategori
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahKategori;
