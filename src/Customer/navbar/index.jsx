import React from 'react';
import NavbarLogo from './NavbarLogo.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarActions from './NavbarActions.jsx';

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">
      <div className="w-full">
        {/* 
            STRUKTUR UTAMA NAVBAR:
            - flex: Menyusun elemen ke samping.
            - justify-between: Membagi ruang agar Logo di kiri dan Tombol di kanan (Rata Kanan Kiri).
            - h-16: Tinggi di HP.
            - lg:h-[110px]: Tinggi di Laptop.
        */}
        <div className="flex h-16 w-full items-center justify-between px-4 sm:h-[84px] sm:px-6 md:h-[90px] md:px-8 lg:h-[115px] lg:px-12 xl:h-[110px] xl:px-14">
          
          {/* LOGO (Rata Kiri) */}
          <div className="flex-none">
            <NavbarLogo />
          </div>

          {/* 
              MENU LINK (Tengah):
              - hidden: Hilang di HP.
              - md:flex: Muncul di Laptop.
          */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavbarLinks />
          </div>

          {/* TOMBOL AKSI (Rata Kanan) */}
          <div className="flex-none">
            <NavbarActions />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
