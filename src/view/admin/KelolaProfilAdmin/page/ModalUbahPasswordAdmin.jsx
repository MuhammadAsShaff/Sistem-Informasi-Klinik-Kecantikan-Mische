import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

/**
 * KOTAK KUNCI PENGAMAN UBAH PASSWORD (ModalUbahPasswordAdmin)
 * Ibarat kotak khusus bergembok yang muncul di atas meja saat tombol "Ubah Password" ditekan. 
 * Kotak ini tidak memikirkan perhitungan rumit; semua urusan pembuatan kunci, pemeriksaan 
 * kombinasi huruf besar/kecil, dan pengirimannya ditangani langsung oleh tukang kunci 
 * (useUbahPasswordAdmin) yang dititipkan lewat jalur 'hook'.
 */
const ModalUbahPasswordAdmin = ({ isOpen, onClose, hook }) => {
  // Meminjam alat-alat dan kertas isian dari tukang kunci
  const {
    passwordData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errorMessage,
    handleChange,
    handleSave,
  } = hook;

  // Jika saklar pembukanya belum ditekan, kotak ini tetap disembunyikan
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in duration-300">

        {/* --- BAGIAN ATAS KOTAK (JUDUL & SIMBOL GEMBOK) --- */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#e1f5ec] p-3 rounded-full text-[#48a176]">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 text-center">Ubah Password</h2>
        </div>

        {/* --- PAPAN PENGUMUMAN JIKA ADA KESALAHAN --- */}
        {errorMessage && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* --- KOTAK ISIAN KUNCI RAHASIA --- */}
        <div className="flex flex-col gap-4">

          {/* Kotak Isian 1: Kunci Rahasia Baru */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Password Baru</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#55BC36]"
                placeholder="******"
              />
              {/* Saklar Intip Tulisan (Mata / Mata Dicoret) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-red-500 mt-2 font-medium">
              *Wajib diisi. Minimal 8 karakter dan harus mengandung kombinasi huruf{" "}
              <strong>BESAR</strong> dan <strong>kecil</strong>.
            </p>
          </div>

          {/* Kotak Isian 2: Kunci Cadangan (Konfirmasi) */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#55BC36]"
                placeholder="******"
              />
              {/* Saklar Intip Tulisan (Mata / Mata Dicoret) */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* --- TOMBOL-TOMBOL TINDAKAN DI BAWAH KOTAK --- */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={handleSave}
            className="w-full bg-[#55BC36] hover:bg-[#4ea830] transition-colors text-white font-bold py-3 rounded-xl shadow-lg"
          >
            Simpan Password
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-bold py-3 rounded-xl"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalUbahPasswordAdmin;
