import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegistrasi } from "../hooks/useRegistrasi";
import ToastAlert from "@/view/components/ToastAlert/page/Index";

/**
 * =========================================================================
 * KOMPONEN: RegistrasiForm (FORM REGISTRASI - TAMPILAN MURNI / VIEW)
 * =========================================================================
 * Komponen ini hanya fokus pada rendering tampilan form pendaftaran customer.
 * Semua state input, validasi kekuatan password, dan pengiriman data ke server 
 * didelegasikan sepenuhnya ke custom hook `useRegistrasi`.
 */
const RegistrasiForm = () => {
  // Destrukturisasi semua state & fungsi yang disediakan oleh hook `useRegistrasi`
  const {
    formData,                       // Objek utama penyimpan seluruh input form
    showPassword, setShowPassword,   // State & fungsi tampil/sembunyi password
    showConfirmPassword, setShowConfirmPassword, // State & fungsi tampil/sembunyi konfirmasi password
    handleChange,                   // Fungsi pencatat perubahan ketikan user
    handleSubmit,                   // Fungsi pengirim data form pendaftaran ke server
    toast,
    setToast
  } = useRegistrasi();

  return (
    <>
      {/* TOAST ALERT: Umpan balik notifikasi melayang (sukses / gagal) */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      {/* onSubmit={handleSubmit}: Saat tombol registrasi ditekan, kirim data via handleSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">

          {/* KOLOM NAMA */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Nama</label>
            <input 
              type="text" 
              name="nama" 
              value={formData.nama} // Diikat ke properti nama di state formData
              onChange={handleChange} // Pantau perubahan ketikan
              placeholder="Nama" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nama lengkap Anda.</p>
          </div>

          {/* KOLOM EMAIL */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} // Diikat ke properti email
              onChange={handleChange} 
              placeholder="Email" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan format email yang valid.</p>
          </div>

          {/* KOLOM NOMOR WHATSAPP */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Nomor WhatsApp</label>
            <input 
              type="text" 
              name="nomorWa" 
              value={formData.nomorWa} // Diikat ke properti nomorWa (otomatis difilter hanya angka di hook)
              onChange={handleChange} 
              placeholder="Nomor WhatsApp" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nomor telepon aktif.</p>
          </div>

          {/* KOLOM ALAMAT */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Alamat</label>
            <input 
              type="text" 
              name="alamat" 
              value={formData.alamat} // Diikat ke properti alamat
              onChange={handleChange} 
              placeholder="Alamat" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan alamat domisili.</p>
          </div>

          {/* PILIHAN JENIS KELAMIN */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Jenis Kelamin</label>
            <select 
              name="jenisKelamin" 
              value={formData.jenisKelamin} // Diikat ke jenisKelamin
              onChange={handleChange} 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#56BC36] transition-colors"
            >
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">* Wajib memilih jenis kelamin.</p>
          </div>

          {/* KOLOM TANGGAL LAHIR */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Tanggal Lahir</label>
            <input 
              type="date" 
              name="tanggalLahir" 
              value={formData.tanggalLahir} // Diikat ke tanggalLahir
              onChange={handleChange} 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan tanggal lahir yang sesuai.</p>
          </div>

          {/* KOLOM PASSWORD */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // Sembunyi/tampilkan password secara dinamis
                name="password" 
                value={formData.password} // Diikat ke properti password
                onChange={handleChange}
                placeholder="******" 
                required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-red-500 font-medium mt-1">* Wajib diisi. Minimal 8 karakter dan mengandung huruf besar dan kecil.</p>
          </div>

          {/* KOLOM KONFIRMASI PASSWORD */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Konfirmasi Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} // Sembunyi/tampilkan secara dinamis
                name="confirmPassword" 
                value={formData.confirmPassword} // Diikat ke confirmPassword untuk dicocokkan di hook
                onChange={handleChange}
                placeholder="******" 
                required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi. Pastikan sama dengan kolom password.</p>
          </div>

        </div>

        {/* TOMBOL REGISTRASI */}
        <div className="mt-2">
          <button 
            type="submit"
            className="w-fit px-12 bg-[#56BC36] hover:bg-[#4ea830] transition-colors duration-300 text-white font-bold text-[18px] py-3 rounded-full shadow-lg active:scale-[0.98]"
          >
            Registrasi
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrasiForm;
