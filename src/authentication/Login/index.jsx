import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../../assets/LogoMische.png';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      {/* CARD KONTANER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[500px] p-8 md:p-12 border border-gray-100">
        
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Mische Aesthetic Clinic" className="h-14 w-auto object-contain" />
        </div>

        {/* HEADER TEXT */}
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-black mb-1">Login</h1>
          <p className="text-[14px] text-gray-700 font-medium">
            Masukkan Email Dan Password Yang Terdaftar
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-5">
          {/* EMAIL */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">
              Email
            </label>
            <input 
              type="email" 
              placeholder="Email"
              className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-black font-semibold text-[15px] mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
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

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className="w-full bg-[#56BC36] hover:bg-[#4ea830] transition-colors duration-300 text-white font-bold text-[18px] py-4 rounded-3xl mt-4 shadow-lg active:scale-[0.98]"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
