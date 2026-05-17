import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export default function ModalPerbaruiUser({ isOpen, onClose, userData, onSubmit }) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "", // Ditambahkan untuk update password
    jenisKelamin: "",
    alamat: "",
    role: "",
    tanggalLahir: "",
    nomorWa: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  // Saat userData berubah (saat tombol Edit ditekan), masukkan datanya ke form
  useEffect(() => {
    if (userData) {
      setFormData({
        nama: userData.nama || "",
        email: userData.email || "",
        password: "", // Kosongkan agar hanya diisi jika ingin diubah
        jenisKelamin: userData.jenisKelamin || userData.gender || userData.jenis_kelamin || "",
        alamat: userData.alamat || "",
        role: userData.role || "",
        // Karena Laravel sudah mengembalikan format YYYY-MM-DD (contoh: 1991-04-16), kita bisa langsung pakai
        tanggalLahir: userData.tanggalLahir || userData.birth || userData.tanggal_lahir || "",
        nomorWa: userData.nomorWa || userData.whatsapp || userData.nomor_whatsapp || userData.no_wa || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorWa') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* HEADER MODAL */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="px-10 py-8">
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
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Alamat"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
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

            {/* Tanggal Lahir (Date Picker) */}
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
            </div>

          </div>

          {/* FOOTER ACTION */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              className="bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
