import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegistrasi } from "../hooks/useRegistrasi";
import ToastAlert from "@/view/components/ToastAlert";

/**
 * Form registrasi — pure UI.
 * Semua logic (state form, validasi, submit) dikelola oleh hook `useRegistrasi`.
 */
const RegistrasiForm = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  const {
    formData,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleChange,
    handleSubmit,
  } = useRegistrasi(navigate, showToast);

  return (
    <>
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">

          {/* NAMA */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Nama</label>
            <input type="text" name="nama" value={formData.nama} onChange={handleChange}
              placeholder="Nama" required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nama lengkap Anda.</p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email" required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan format email yang valid.</p>
          </div>

          {/* NOMOR WHATSAPP */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Nomor WhatsApp</label>
            <input type="text" name="nomorWa" value={formData.nomorWa} onChange={handleChange}
              placeholder="Nomor WhatsApp" required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nomor telepon aktif.</p>
          </div>

          {/* ALAMAT */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Alamat</label>
            <input type="text" name="alamat" value={formData.alamat} onChange={handleChange}
              placeholder="Alamat" required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan alamat domisili.</p>
          </div>

          {/* JENIS KELAMIN */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Jenis Kelamin</label>
            <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#56BC36] transition-colors">
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">* Wajib memilih jenis kelamin.</p>
          </div>

          {/* TANGGAL LAHIR */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Tanggal Lahir</label>
            <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan tanggal lahir yang sesuai.</p>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                placeholder="******" required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-red-500 font-medium mt-1">* Wajib diisi. Minimal 8 karakter dan mengandung huruf besar dan kecil.</p>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Konfirmasi Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                placeholder="******" required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi. Pastikan sama dengan kolom password.</p>
          </div>

        </div>

        {/* SUBMIT */}
        <div className="mt-2">
          <button type="submit"
            className="w-fit px-12 bg-[#56BC36] hover:bg-[#4ea830] transition-colors duration-300 text-white font-bold text-[18px] py-3 rounded-full shadow-lg active:scale-[0.98]">
            Registrasi
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrasiForm;
