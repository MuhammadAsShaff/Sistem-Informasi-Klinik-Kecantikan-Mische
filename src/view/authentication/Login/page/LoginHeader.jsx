import React from 'react';
import Logo from '@/assets/images/LogoMische.png';

const LoginHeader = () => {
  return (
    <>
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
    </>
  );
};

export default LoginHeader;
