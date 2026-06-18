import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ToastAlert from '@/view/components/ToastAlert';

const ModalFormAlamat = ({ isOpen, onClose, onSave, provinces, cities, fetchCities }) => {
  const [formData, setFormData] = useState({
    namaPenerima: '',
    nomorHp: '',
    provinceId: '',
    cityId: '',
    kecamatan: '',
    kodePos: '',
    detailAlamat: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        namaPenerima: '',
        nomorHp: '',
        provinceId: '',
        cityId: '',
        kecamatan: '',
        kodePos: '',
        detailAlamat: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorHp') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'provinceId') {
      setFormData(prev => ({ ...prev, cityId: '' }));
      fetchCities(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaPenerima || !formData.nomorHp || !formData.provinceId || !formData.cityId || !formData.kecamatan || !formData.kodePos || !formData.detailAlamat) {
      setToast({ isOpen: true, message: "Harap lengkapi semua field bertanda *", type: "warning" });
      return;
    }

    setIsSubmitting(true);
    const success = await onSave(formData);
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative my-auto">
        
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Tambah Alamat Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="px-10 py-8 max-h-[70vh] overflow-y-auto">
          <form id="form-alamat" onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-12 gap-y-8 mb-2">
            
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Nama Penerima *</label>
              <input type="text" name="namaPenerima" value={formData.namaPenerima} onChange={handleChange}
                placeholder="Nama Lengkap"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500" />
            </div>
            
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Nomor WhatsApp *</label>
              <input type="text" name="nomorHp" value={formData.nomorHp} onChange={handleChange}
                placeholder="08..."
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500" />
              <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka (contoh: 08123456789)</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Provinsi *</label>
              <select name="provinceId" value={formData.provinceId} onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-500 appearance-none">
                <option value="">Pilih Provinsi</option>
                {provinces.map(prov => (
                  <option key={prov.province_id} value={prov.province_id}>{prov.province}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Kota/Kabupaten *</label>
              <select name="cityId" value={formData.cityId} onChange={handleChange} disabled={!formData.provinceId}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-500 disabled:bg-gray-50 disabled:text-gray-400 appearance-none">
                <option value="">Pilih Kota</option>
                {cities.map(city => (
                  <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Kecamatan*</label>
              <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange}
                placeholder="Kecamatan (Opsional)"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500" />
            </div>
            
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Kode Pos*</label>
              <input type="text" name="kodePos" value={formData.kodePos} onChange={handleChange}
                placeholder="Kode Pos"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500" />
            </div>

            <div className="flex flex-col gap-2.5 col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-[#1A1A1A]">Detail Alamat (Jalan, No Rumah, RT/RW) *</label>
              <textarea name="detailAlamat" value={formData.detailAlamat} onChange={handleChange} rows="3"
                placeholder="Masukkan detail alamat lengkap"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500 resize-none"></textarea>
              <p className="text-[11px] text-red-500 italic mt-0.5">* Isi dengan lengkap (Jalan, RT/RW, Patokan)</p>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-white">
          <button onClick={onClose} className="px-8 py-4 rounded-xl font-bold text-[#1A1A1A] hover:bg-gray-100 transition">
            Batal
          </button>
          <button form="form-alamat" type="submit" disabled={isSubmitting}
            className="bg-[#7CC052] hover:bg-[#68a741] text-white px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-100 disabled:opacity-50">
            {isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
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
};

export default ModalFormAlamat;
