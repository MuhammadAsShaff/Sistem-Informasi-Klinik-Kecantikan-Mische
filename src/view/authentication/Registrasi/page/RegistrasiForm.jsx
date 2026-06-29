import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegistrasi } from "../hooks/useRegistrasi";
import ToastAlert from "@/view/components/ToastAlert/page/Index";

/**
 * =========================================================================
 * MEJA FORMULIR BUKU INDUK PENDAFTARAN (RegistrasiForm)
 * =========================================================================
 * Ibarat meja panjang di balai pendaftaran yang membentangkan kertas isian
 * terbagi dalam dua lajur rapi. Meja ini dibantu oleh Mandor Pendaftaran 
 * (useRegistrasi) yang memegang pena pencatat, penghapus otomatis nomor WA,
 * serta mistar pengukur kekuatan sandi rahasia.
 */
const RegistrasiForm = () => {
  // Meminjam seluruh laci penyimpanan dan tuas kendali dari Mandor Pendaftaran (useRegistrasi)
  const {
    formData,                       // Laci arsip penyimpan ketikan biodata tamu
    showPassword, setShowPassword,   // Tuas penyingkap tirai sandi pertama & pengaturnya
    showConfirmPassword, setShowConfirmPassword, // Tuas penyingkap tirai sandi kedua & pengaturnya
    handleChange,                   // Pena otomatis pencatat gerak-gerik ketikan tamu
    handleSubmit,                   // Tombol lonceng pengutus kurir ke pusat pendaftaran
    toast,                          // Kotak pengumuman plang melayang
    setToast                        // Tuas penurun plang pengumuman
  } = useRegistrasi();

  return (
    <>
      {/* ─── PAPAN PLANG NOTIFIKASI MELAYANG (TOAST ALERT) ──────────────────── */}
      {/* Muncul melayang di hadapan tamu untuk memberi selamat atau menegur kesalahan isian */}
      <ToastAlert
        isOpen={toast.isOpen} // Syarat pembuka plang
        message={toast.message} // Kalimat ukiran pada plang
        type={toast.type} // Warna plang (hijau sukses / merah error)
        onClose={() => setToast({ ...toast, isOpen: false })} // Tuas penutup plang
      />

      {/* ─── PEMBUNGKUS UTAMA MEJA FORMULIR ─────────────────────────────────── */}
      {/* onSubmit={handleSubmit}: Begitu tombol Registrasi ditekan, bunyikan lonceng Mandor */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Kisi-kisi laci isian yang membagi meja menjadi 2 lajur bersebelahan (grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">

          {/* ─── KOTAK ISIAN NAMA LENGKAP ───────────────────────────────────── */}
          <div>
            {/* Plang penunjuk nama kotak isian */}
            <label className="block text-black font-semibold text-[15px] mb-2">Nama</label>
            <input 
              type="text" 
              name="nama" 
              value={formData.nama} // Ditambatkan pada arsip laci 'nama'
              onChange={handleChange} // Digerakkan oleh pena Mandor
              placeholder="Nama" 
              required // Wajib diisi (pantang dikosongkan)
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            {/* Catatan kaki penjelas syarat pengisian */}
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nama lengkap Anda.</p>
          </div>

          {/* ─── KOTAK ISIAN ALAMAT EMAIL ───────────────────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} // Ditambatkan pada arsip laci 'email'
              onChange={handleChange} 
              placeholder="Email" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan format email yang valid.</p>
          </div>

          {/* ─── KOTAK ISIAN NOMOR WHATSAPP ─────────────────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Nomor WhatsApp</label>
            <input 
              type="text" 
              name="nomorWa" 
              value={formData.nomorWa} // Ditambatkan pada laci 'nomorWa' (otomatis dijaga Mandor agar hanya berisi angka)
              onChange={handleChange} 
              placeholder="Nomor WhatsApp" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan nomor telepon aktif.</p>
          </div>

          {/* ─── KOTAK ISIAN ALAMAT DOMISILI ────────────────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Alamat</label>
            <input 
              type="text" 
              name="alamat" 
              value={formData.alamat} // Ditambatkan pada arsip laci 'alamat'
              onChange={handleChange} 
              placeholder="Alamat" 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan alamat domisili.</p>
          </div>

          {/* ─── LACI PEMILIH JENIS KELAMIN (DROPDOWN SELECT) ───────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Jenis Kelamin</label>
            <select 
              name="jenisKelamin" 
              value={formData.jenisKelamin} // Ditambatkan pada arsip laci 'jenisKelamin'
              onChange={handleChange} 
              required // Wajib memilih salah satu
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#56BC36] transition-colors"
            >
              {/* Menu pembuka pembatas (tidak bisa dipilih) */}
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">* Wajib memilih jenis kelamin.</p>
          </div>

          {/* ─── KOTAK ISIAN TANGGAL LAHIR (DATE PICKER) ────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Tanggal Lahir</label>
            <input 
              type="date" 
              name="tanggalLahir" 
              value={formData.tanggalLahir} // Ditambatkan pada arsip laci 'tanggalLahir'
              onChange={handleChange} 
              required
              className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi dengan tanggal lahir yang sesuai.</p>
          </div>

          {/* ─── KOTAK ISIAN SANDI RAHASIA UTAMA ────────────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
            <div className="relative">
              <input 
                // Tirai otomatis penyingkap/penyembunyi huruf sandi
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} // Ditambatkan pada laci 'password'
                onChange={handleChange}
                placeholder="******" 
                required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" 
              />
              
              {/* Tuas pembuka tirai sandi pertama */}
              <button 
                type="button" // type="button" agar tidak memicu lonceng pengiriman form
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Peringatan ketat mengenai syarat ketangguhan sandi */}
            <p className="text-xs text-red-500 font-medium mt-1">* Wajib diisi. Minimal 8 karakter dan mengandung huruf besar dan kecil.</p>
          </div>

          {/* ─── KOTAK ISIAN ULANGAN SANDI (KONFIRMASI) ─────────────────────── */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">Konfirmasi Password</label>
            <div className="relative">
              <input 
                // Tirai otomatis untuk kotak ulangan sandi
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} // Ditambatkan pada laci 'confirmPassword' untuk dicocokkan Mandor
                onChange={handleChange}
                placeholder="******" 
                required
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12" 
              />
              
              {/* Tuas pembuka tirai sandi kedua */}
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Catatan pengingat agar isian sama persis dengan kotak sebelumnya */}
            <p className="text-xs text-gray-500 mt-1">* Wajib diisi. Pastikan sama dengan kolom password.</p>
          </div>

        </div>

        {/* ─── TOMBOL LONCENG REGISTRASI UTAMA ──────────────────────────────── */}
        <div className="mt-2">
          {/* Tombol lonceng hijau besar pembawa formulir ke pusat pendaftaran */}
          <button 
            type="submit" // type="submit" untuk memicu lonceng handleSubmit
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

