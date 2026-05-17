import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

/**
 * Form login — pure UI.
 * Semua logic (state, rate limiting, submit) dikelola oleh hook `useLogin`.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    errorMessage,
    lockoutTime,
    timeLeft,
    handleLogin,
  } = useLogin(navigate);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleLogin}>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-sm">
          {errorMessage}
        </div>
      )}

      {/* EMAIL */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
        />
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* TOMBOL LOGIN */}
      <button
        type="submit"
        disabled={isLoading || !!lockoutTime}
        className={`w-full transition-colors duration-300 text-white font-bold text-[18px] py-4 rounded-3xl mt-4 shadow-lg active:scale-[0.98] ${
          isLoading || lockoutTime ? "bg-gray-400 cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#4ea830]"
        }`}
      >
        {isLoading ? "Sedang Memproses..." : lockoutTime ? `Terkunci (${timeLeft}s)` : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
