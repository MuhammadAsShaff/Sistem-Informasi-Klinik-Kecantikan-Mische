import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
  );
};

export default LoginForm;
