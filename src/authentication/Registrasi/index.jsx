import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../../assets/LogoMische.png';

export default function RegistrasiPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      {/* CARD KONTANER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[800px] p-8 md:p-12 border border-gray-100">
        
        {/* LOGO */}
        <div className="flex justify-center mb-8 md:mb-10">
          <img src={Logo} alt="Mische Aesthetic Clinic" className="h-14 w-auto object-contain" />
        </div>

        {/* HEADER TEXT */}
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-black mb-1">Registrasi</h1>
          <p className="text-[14px] text-black font-medium">
            Daftar Akun Dengan Data Diri Anda Yang Benar
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">
            {/* NAMA */}
            <div>
              <label className="block text-black font-semibold text-[15px] mb-2">
                Nama
              </label>
              <input 
                type="text" 
                placeholder="Nama"
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-black font-semibold text-[15px] mb-2">
                Email
              </label>
              <input 
                type="email" 
                placeholder="Email"
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
              />
            </div>

            {/* NOMOR WHATSAPP */}
            <div>
              <label className="block text-black font-semibold text-[15px] mb-2">
                Nomor WhatsApp
              </label>
              <input 
                type="text" 
                placeholder="Nomor WhatsApp"
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
              />
            </div>

            {/* ALAMAT */}
            <div>
              <label className="block text-black font-semibold text-[15px] mb-2">
                Alamat
              </label>
              <input 
                type="text" 
                placeholder="Alamat"
                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
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
                  placeholder="******"
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
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="block text-black font-semibold text-[15px] mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="******"
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
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-2">
            <button 
              type="submit"
              className="w-fit px-12 bg-[#56BC36] hover:bg-[#4ea830] transition-colors duration-300 text-white font-bold text-[18px] py-3 rounded-full shadow-lg active:scale-[0.98]"
            >
              Registrasi
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
