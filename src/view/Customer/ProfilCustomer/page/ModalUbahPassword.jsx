import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

/**
 * Modal ubah password customer — pure UI.
 * Logic dikelola oleh hook `useUbahPasswordCustomer` via prop `hook`.
 */
const ModalUbahPassword = ({ isOpen, onClose, hook }) => {
  const {
    passwordData,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    errorMessage,
    handleChange,
    handleSave,
  } = hook;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in duration-300">

        {/* HEADER */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-full text-orange-500">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 text-center">Ubah Password</h2>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* Password Baru */}
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
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-red-500 mt-2 font-medium">
              *Wajib diisi. Minimal 8 karakter dan harus mengandung kombinasi huruf <strong>BESAR</strong> dan <strong>kecil</strong>.
            </p>
          </div>

          {/* Konfirmasi Password */}
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
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 mt-2">
          <button onClick={handleSave}
            className="w-full bg-[#55BC36] hover:bg-[#4ea830] transition-colors text-white font-bold py-3 rounded-xl shadow-lg">
            Simpan Password
          </button>
          <button onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-bold py-3 rounded-xl">
            Batal
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalUbahPassword;
