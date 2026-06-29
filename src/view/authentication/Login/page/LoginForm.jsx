import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

/**
 * =========================================================================
 * MEJA FORMULIR PEMERIKSAAN KARTU IDENTITAS (LoginForm)
 * =========================================================================
 * Ibarat meja tulis kayu di pos satpam depan. Meja ini menyediakan kertas
 * isian untuk menuliskan email dan sandi rahasia. Meja ini tidak bekerja sendiri,
 * melainkan dibantu oleh Mandor Gerbang Utama (useLogin) yang akan memeriksa
 * keabsahan sandi dan memberlakukan hukuman kunci jika salah ketik berkali-kali.
 */
const LoginForm = () => {

  // Meminjam seluruh laci penyimpanan dan tuas kendali dari Mandor Gerbang (useLogin)
  const {
    email, setEmail,                 // Laci isian email & pena penulisan email
    password, setPassword,           // Laci isian sandi & pena penulisan sandi
    showPassword, setShowPassword,   // Tuas penyingkap tirai sandi & pengaturnya
    isLoading,                        // Lampu tanda Mandor sedang berlari ke arsip
    errorMessage,                     // Tulisan pengumuman penolakan di papan tulis
    lockoutTime,                      // Stempel gembok penahan tamu
    timeLeft,                         // Angka hitung mundur (detik) pembuka gembok
    handleLogin,                      // Tombol lonceng pengirim dokumen ke pusat
  } = useLogin();

  return (
    // onSubmit={handleLogin}: Saat tombol masuk ditekan, bunyikan lonceng handleLogin milik Mandor
    <form className="flex flex-col gap-5" onSubmit={handleLogin}>

      {/* ─── PAPAN PENGUMUMAN PENOLAKAN (HANYA MUNCUL JIKA ADA MASALAH) ─────── */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-sm">
          {errorMessage}
        </div>
      )}

      {/* ─── KOTAK ISIAN EMAIL ──────────────────────────────────────────────── */}
      <div>
        {/* Plang penunjuk nama kotak isian */}
        <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email} // Menambatkan tulisan di kertas dengan laci 'email'
          onChange={(e) => setEmail(e.target.value)} // Mengisi laci setiap kali ujung pena tamu bergerak
          required // Wajib diisi (tidak boleh mengumpulkan kertas kosong)
          className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
        />
      </div>

      {/* ─── KOTAK ISIAN SANDI RAHASIA (PASSWORD) ───────────────────────────── */}
      <div>
        {/* Plang penunjuk nama kotak isian sandi */}
        <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
        <div className="relative">
          <input
            // Tirai otomatis: jika tuas showPassword ditarik, ubah jadi teks biasa. Jika tidak, pasang topeng bintang-bintang
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password} // Menambatkan tulisan dengan laci 'password'
            onChange={(e) => setPassword(e.target.value)} // Catat di laci seketika saat tamu mengetik
            required // Wajib diisi
            className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
          />
          
          {/* ─── TUAS PEMBUKA/PENUTUP TIRAI SANDI ───────────────────────────── */}
          <button
            type="button" // type="button" agar menekan tuas ini tidak salah disangka menekan tombol lonceng kirim
            onClick={() => setShowPassword(!showPassword)} // Tarik tuas bolak-balik (buka/tutup)
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {/* Mengganti lukisan ikon mata terbuka (Eye) atau mata dicoret (EyeOff) sesuai tuas */}
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* ─── TOMBOL LONCENG UTAMA (SUBMIT LOGIN) ────────────────────────────── */}
      <button
        type="submit" // type="submit" untuk membunyikan lonceng pengiriman form
        // Gembok tombol: Tombol dibekukan (disabled) jika Mandor sedang memproses atau tamu sedang dihukum gembok
        disabled={isLoading || !!lockoutTime}
        className={`w-full transition-colors duration-300 text-white font-bold text-[18px] py-4 rounded-3xl mt-4 shadow-lg active:scale-[0.98] ${
          isLoading || lockoutTime ? "bg-gray-400 cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#4ea830]"
        }`}
      >
        {/* Ubah ukiran tulisan di atas tombol sesuai suasana hati Mandor dan status gembok */}
        {isLoading 
          ? "Sedang Memproses..." 
          : lockoutTime 
            ? `Terkunci (${timeLeft}s)` 
            : "Login"
        }
      </button>
    </form>
  );
};

export default LoginForm;

