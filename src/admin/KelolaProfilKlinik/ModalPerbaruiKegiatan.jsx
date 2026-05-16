import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ModalEditKegiatan = ({ isOpen, onClose, id, onSuccess }) => {
  const [formData, setFormData] = useState({
    namaKegiatan: '',
    deskripsi: '',
    tanggalKegiatan: '',
    foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && id) {
      fetchDetail();
    }
  }, [isOpen, id]);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/kegiatan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const item = res.data.data.find(k => k.idKegiatan === id || k.id === id);
        if (item) {
          setFormData({
            namaKegiatan: item.namaKegiatan || '',
            deskripsi: item.deskripsi || '',
            tanggalKegiatan: item.tanggalKegiatan ? item.tanggalKegiatan.substring(0, 10) : '',
            foto: null
          });
          setPreviewImage(item.foto ? `http://127.0.0.1:8000/storage/${item.foto}` : null);
        }
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file tidak didukung! Pastikan menggunakan file gambar dengan ekstensi: jpeg, png, atau jpg.");
        e.target.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Maksimal ukuran gambar adalah 2MB.');
        e.target.value = '';
        return;
      }
      setErrorMessage('');
      setFormData({ ...formData, foto: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!formData.namaKegiatan || !formData.deskripsi || !formData.tanggalKegiatan) {
      setErrorMessage('Harap isi nama kegiatan, deskripsi, dan tanggal kegiatan!');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const payload = new FormData();
      
      payload.append('_method', 'PUT'); // Spoofing PUT
      payload.append('namaKegiatan', formData.namaKegiatan);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalKegiatan', formData.tanggalKegiatan);
      if (formData.foto) {
        payload.append('foto', formData.foto);
      }

      const res = await axios.post(`http://127.0.0.1:8000/api/admin/kegiatan/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        onSuccess && onSuccess();
      }
    } catch (error) {
      let errorMsg = 'Gagal memperbarui kegiatan. Silakan cek inputan Anda.';
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[750px] rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-[20px] font-bold text-black">Perbarui Kegiatan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading}>
            <X size={24} />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        <div className="p-6 grid grid-cols-12 gap-8">
          
          <div className="col-span-5 flex flex-col">
            <div className="border border-black h-[180px] w-full flex items-center justify-center text-[15px] font-semibold mb-4 bg-gray-100 overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">Foto Kegiatan</span>
              )}
            </div>
            
            <p className="text-[13px] text-gray-800 text-center mb-4">Ubah Gambar Kegiatan</p>
            
            <div className="flex flex-col">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full file:bg-[#1f2937] file:text-white file:border-black file:rounded-none file:px-3 file:py-1.5 file:cursor-pointer file:text-xs file:font-medium text-xs text-black border border-black p-0 bg-white"
              />
              <span className="text-[11px] text-red-500 mt-1">* Maksimal 2MB (Format: jpeg, png, jpg)</span>
            </div>
          </div>

          <div className="col-span-7 flex flex-col">
            <p className="text-[13px] text-gray-800 mb-6 leading-relaxed">
              Anda dapat memperbarui informasi kegiatan dengan nama, deskripsi, dan gambar. Pastikan untuk memasukkan informasi terbaru agar data selalu akurat.
            </p>

            <div className="mb-4">
              <label className="block text-[14px] text-black mb-2">Nama Kegiatan</label>
              <input 
                type="text" 
                name="namaKegiatan"
                value={formData.namaKegiatan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white" 
                placeholder="Nama Kegiatan" 
              />
            </div>

            <div className="mb-4">
              <label className="block text-[14px] text-black mb-2">Tanggal Kegiatan</label>
              <input 
                type="date" 
                name="tanggalKegiatan"
                value={formData.tanggalKegiatan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white" 
              />
            </div>

            <div className="mb-2">
              <label className="block text-[14px] text-black mb-2">Deskripsi Kegiatan</label>
              <textarea 
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white min-h-[100px] resize-none" 
                placeholder="Deskripsi Kegiatan" 
              ></textarea>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`bg-[#55BC36] hover:bg-[#46a02b] text-white px-6 py-2.5 rounded-md font-medium text-[14px] transition-colors shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalEditKegiatan;
