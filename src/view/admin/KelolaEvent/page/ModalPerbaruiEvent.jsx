import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useEditEvent } from '../hooks/useEditEvent';

export default function ModalPerbaruiEvent({ isOpen, onClose, refetch, showToast, event }) {
  const { editEvent } = useEditEvent(refetch);
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deskripsi: '',
    foto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        nama: event.nama || '',
        lokasi: event.lokasi || '',
        tanggalMulai: event.tanggalMulai ? event.tanggalMulai.split(' ')[0] : '', // Extract date part if needed
        tanggalSelesai: event.tanggalSelesai ? event.tanggalSelesai.split(' ')[0] : '',
        deskripsi: event.deskripsi || '',
        foto: null
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('nama', formData.nama);
    payload.append('lokasi', formData.lokasi);
    payload.append('tanggalMulai', formData.tanggalMulai);
    payload.append('tanggalSelesai', formData.tanggalSelesai);
    payload.append('deskripsi', formData.deskripsi);
    if (formData.foto) {
      payload.append('foto', formData.foto);
    }
    
    const result = await editEvent(event.id || event.idEvent, payload);
    setIsSubmitting(false);
    
    if (result.success) {
      showToast(result.message);
      onClose();
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Perbarui Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Event */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Event</label>
                <input 
                  type="text" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama Event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Lokasi</label>
                <input 
                  type="text" 
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Lokasi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm appearance-none"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm appearance-none"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            {/* Deskripsi Event */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Event</label>
              <textarea 
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi Event"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm resize-none"
                required
              ></textarea>
            </div>

            {/* Foto Event */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Ubah Foto Event (Kosongkan jika tidak ingin mengubah)</label>
              <input 
                type="file" 
                name="foto"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG. Max: 4MB.</p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            type="submit"
            form="edit-event-form"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#45a025] text-white"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
