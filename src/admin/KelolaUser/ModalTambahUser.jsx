import React, { useState } from "react";
import { X } from "lucide-react";

export default function ModalTambahUser({ isOpen, onClose, onSubmit }) {
  // State untuk form
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "", // User baru butuh password
    jenisKelamin: "",
    alamat: "",
    role: "",
    tanggalLahir: "",
    nomorWa: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Tambah User</h2>
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

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan Password" 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Jenis Kelamin</label>
              <select 
                name="jenisKelamin" 
                value={formData.jenisKelamin} 
                onChange={handleChange} 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-400"
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
                value={formData.role} 
                onChange={handleChange} 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-400"
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
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-400"
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
              Tambah User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
