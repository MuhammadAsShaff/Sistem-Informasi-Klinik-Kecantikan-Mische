import React from 'react';
import Logo from '@/assets/images/LogoMische.png';

const RegistrasiHeader = () => {
    return (
        <>
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
        </>
    );
};

export default RegistrasiHeader;
