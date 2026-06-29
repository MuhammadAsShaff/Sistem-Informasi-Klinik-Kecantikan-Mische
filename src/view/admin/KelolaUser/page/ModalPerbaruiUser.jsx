import React from "react";
import { X, Eye, EyeOff, MapPin } from "lucide-react";
import ModalKelolaAlamat from "@/view/Customer/ProfilCustomer/page/ModalKelolaAlamat";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useModalPerbaruiUser } from "../hooks/useModalPerbaruiUser";

/**
 * BILIK MEJA KOREKSI BIODATA ANGGOTA (ModalPerbaruiUser)
 * Ibarat bilik meja kerja tertutup tempat pimpinan membetulkan tulisan biodata anggota klinik.
 * Di meja ini, pimpinan bisa mengubah nama, email, mengganti kata sandi baru (atau membiarkannya kosong agar utuh),
 * mengubah jenis kelamin, kedudukan (Admin/Customer), tanggal lahir, nomor WhatsApp (dijamin hanya angka!),
 * serta membuka laci khusus untuk mengelola riwayat alamat lengkap bagi Customer.
 * Segala urusan pengawalan kelengkapan berkas dibantu oleh Asisten Pengawal Meja (useModalPerbaruiUser).
 */
export default function ModalPerbaruiUser({ isOpen, onClose, hook }) {
  // Meminta pena, laci isian, saklar senter, dan gembok alamat dari Asisten Pengawal Meja Koreksi
  const {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    isModalAlamatOpen,
    setIsModalAlamatOpen,
    toast,
    setToast,
    dummyHookKelolaAlamat,
    handleAlamatClick
  } = useModalPerbaruiUser(hook);

  if (!isOpen) return null; // Jika saklar ditutup, bilik meja kerja ini dilipat kembali

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">

        {/* Atap Bilik Koreksi Biodata */}
        <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Ruangan Formulir Meja Kerja */}
        <div className="px-10 py-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">

            {/* Kotak Isian Nama User */}
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

            {/* Kotak Isian Email */}
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

            {/* Kotak Isian Password (Opsional) */}
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

            {/* Kotak Pilihan Jenis Kelamin */}
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

            {/* Laci Pembuka Buku Alamat Lengkap */}
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

            {/* Kotak Pilihan Role */}
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

            {/* Kotak Isian Tanggal Lahir */}
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

            {/* Kotak Isian Nomor Whatsapp */}
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
        
        {/* LACI TOMBOL UTUS JURU TULIS PERUBAHAN */}
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

    {/* Laci Meja Khusus Pengelolaan Alamat Lengkap */}
    <ModalKelolaAlamat
      isOpen={isModalAlamatOpen}
      onClose={() => setIsModalAlamatOpen(false)}
      hookKelolaAlamat={dummyHookKelolaAlamat}
    />
    
    {/* TOA Pengumuman Kecil di Meja */}
    <ToastAlert 
      isOpen={toast.isOpen} 
      message={toast.message} 
      type={toast.type} 
      onClose={() => setToast({ ...toast, isOpen: false })} 
    />
    </>
  );
}
