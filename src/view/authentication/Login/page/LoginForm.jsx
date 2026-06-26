import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

/**
 * =========================================================================
 * KOMPONEN: LoginForm (FORM LOGIN - TAMPILAN MURNI / VIEW)
 * =========================================================================
 * Komponen ini hanya fokus pada tampilan/UI form login.
 * Seluruh logika bisnis (state input, rate limiting, hitung mundur lockout, 
 * dan submit data ke server) didelegasikan sepenuhnya ke custom hook `useLogin`.
 */
const LoginForm = () => {

  // Destrukturisasi semua variabel dan fungsi yang disediakan oleh hook `useLogin`
  const {
    email, setEmail,                 // State email & fungsi untuk mengubahnya
    password, setPassword,           // State password & fungsi untuk mengubahnya
    showPassword, setShowPassword,   // Tampilkan password (true/false) & fungsinya
    isLoading,                        // Status pemrosesan data login (loading)
    errorMessage,                     // Pesan kesalahan jika login gagal
    lockoutTime,                      // Timestamp akun terkunci
    timeLeft,                         // Hitung mundur waktu kunci (detik)
    handleLogin,                      // Fungsi utama pengiriman login ke server
  } = useLogin();

  return (
    // onSubmit={handleLogin}: Saat tombol masuk atau form disubmit, jalankan fungsi handleLogin di hook
    <form className="flex flex-col gap-5" onSubmit={handleLogin}>

      {/* BLOK PESAN ERROR (HANYA MUNCUL JIKA ADA ERROR) */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-sm">
          {errorMessage}
        </div>
      )}

      {/* KOLOM EMAIL */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email} // Mengikat input ke state 'email'
          onChange={(e) => setEmail(e.target.value)} // Update state setiap kali user mengetik
          required // Wajib diisi
          className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
        />
      </div>

      {/* KOLOM PASSWORD */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
        <div className="relative">
          <input
            // Tipe input dinamis: 'text' jika showPassword aktif, 'password' jika disembunyikan
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password} // Mengikat input ke state 'password'
            onChange={(e) => setPassword(e.target.value)} // Update state saat mengetik
            required // Wajib diisi
            className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
          />
          {/* TOMBOL TOGGLE UNTUK MENAMPILKAN / MENYEMBUNYIKAN PASSWORD */}
          <button
            type="button" // type="button" agar tombol ini tidak memicu submit form secara tidak sengaja
            onClick={() => setShowPassword(!showPassword)} // Bolak-balik true/false
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {/* Mengganti ikon mata terbuka (Eye) atau dicoret (EyeOff) secara kondisional */}
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* TOMBOL LOGIN */}
      <button
        type="submit" // type="submit" untuk memicu submit form
        // Tombol dimatikan (disabled) jika sedang loading atau jika user sedang dikunci (lockout)
        disabled={isLoading || !!lockoutTime}
        className={`w-full transition-colors duration-300 text-white font-bold text-[18px] py-4 rounded-3xl mt-4 shadow-lg active:scale-[0.98] ${
          isLoading || lockoutTime ? "bg-gray-400 cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#4ea830]"
        }`}
      >
        {/* Tampilkan teks tombol secara kondisional sesuai status loading dan lockout */}
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
