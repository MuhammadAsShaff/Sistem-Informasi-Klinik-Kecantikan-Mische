import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, MapPin } from "lucide-react";
import ModalKelolaAlamat from "@/view/Customer/ProfilCustomer/page/ModalKelolaAlamat";
import { PROVINCES, CITIES } from "@/core/utils/rajaOngkirData";
import ToastAlert from "@/view/components/ToastAlert";

export default function ModalPerbaruiUser({ isOpen, onClose, hook }) {
  const { formData, setFormData, showPassword, setShowPassword, handleChange, handleSubmit } = hook;

  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false);
  const [localCities, setLocalCities] = useState([]);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [alamatList, setAlamatList] = useState([]);

  // Sinkronkan alamatList dengan formData.alamat_lengkap dari hook
  useEffect(() => {
    if (formData.alamat_lengkap && Array.isArray(formData.alamat_lengkap)) {
      setAlamatList(formData.alamat_lengkap);
    } else {
      setAlamatList([]);
    }
  }, [formData.alamat_lengkap]);

  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setLocalCities([]);
      return;
    }
    setLocalCities(CITIES[provinceId] || []);
  };

  const syncToFormData = (newList) => {
    setFormData(prev => ({
      ...prev,
      alamat_lengkap: newList,
      alamat: newList.length > 0 ? `${newList.length} Alamat Tersimpan` : ''
    }));
  };

  const dummyHookKelolaAlamat = {
    alamatList,
    isLoading: false,
    provinces: PROVINCES,
    cities: localCities,
    fetchCities,
    tambahAlamat: async (alamatData) => {
       const newAlamat = { ...alamatData, id: Date.now(), is_utama: alamatList.length === 0 };
       const newList = [...alamatList, newAlamat];
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    },
    hapusAlamat: async (id) => {
       const newList = alamatList.filter(a => a.id !== id);
       if (newList.length > 0 && !newList.some(a => a.is_utama)) {
          newList[0].is_utama = true;
       }
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    },
    jadikanUtama: async (id) => {
       const newList = alamatList.map(a => ({ ...a, is_utama: a.id === id }));
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    }
  };

  const handleAlamatClick = () => {
    if (formData.role.toLowerCase() !== 'customer') {
      setToast({ isOpen: true, message: 'Pengisian alamat lengkap hanya dikhususkan untuk Customer.', type: 'warning' });
      return;
    }
    setIsModalAlamatOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">

        {/* HEADER MODAL */}
        <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="px-10 py-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">

            {/* Nama User */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Nama user</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama user"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
              <p className="text-[11px] text-red-500 italic mt-0.5">* Pastikan format email valid (@gmail.com)</p>
            </div>

            {/* Password (Opsional) */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Password (Opsional)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[11px] text-red-500 italic mt-0.5">* Minimal 8 karakter, mengandung huruf BESAR dan kecil</p>
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700 font-medium"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Alamat</label>
              <button
                type="button"
                onClick={handleAlamatClick}
                className={`flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none ${
                  formData.role.toLowerCase() === 'customer' 
                    ? 'hover:border-[#7CC052] cursor-pointer text-gray-700' 
                    : 'bg-gray-50 cursor-not-allowed text-gray-400'
                }`}
              >
                <span className="truncate pr-4">
                  {formData.role.toLowerCase() === 'customer'
                    ? (formData.alamat_lengkap && formData.alamat_lengkap.length > 0
                        ? `${formData.alamat_lengkap.length} Alamat Tersimpan`
                        : "Klik untuk Tambah Alamat Lengkap")
                    : "Bukan Customer"}
                </span>
                <MapPin size={20} className={formData.role.toLowerCase() === 'customer' ? "text-[#7CC052]" : "text-gray-400"} />
              </button>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Role</label>
              <select
                name="role"
                value={formData.role.toLowerCase()}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700 font-medium"
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Tanggal Lahir */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700"
              />
            </div>

            {/* Nomor Whatsapp */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Nomor Whatsapp</label>
              <input
                type="text"
                name="nomorWa"
                value={formData.nomorWa}
                onChange={handleChange}
                placeholder="Nomor Whatsapp"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
              <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka (contoh: 08123456789)</p>
            </div>


          </div>

        </div>
        
        {/* FOOTER ACTION */}
        <div className="px-10 py-6 flex justify-end border-t border-gray-100 shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            className="bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>

    <ModalKelolaAlamat
      isOpen={isModalAlamatOpen}
      onClose={() => setIsModalAlamatOpen(false)}
      hookKelolaAlamat={dummyHookKelolaAlamat}
    />
    
    <ToastAlert 
      isOpen={toast.isOpen} 
      message={toast.message} 
      type={toast.type} 
      onClose={() => setToast({ ...toast, isOpen: false })} 
    />
    </>
  );
}
