import React, { useState } from 'react';
import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarActions from './NavbarActions';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from './constants';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    //header untuk menampung konten navbar
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">

      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (Sudah Pas - Jangan Diubah) */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full">
        <div className="flex w-full items-center justify-between px-4 md:h-[80px] lg:h-[100px] lg:px-8 xl:h-[90px] xl:px-10">
          <div className="flex-none">
            <NavbarLogo />
          </div>
          <div className="flex-1 justify-center flex">
            <NavbarLinks />
          </div>
          <div className="flex-none">
            <NavbarActions />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW (Dengan Slider / Drawer) */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:h-[84px] sm:px-6">

          {/* LOGO */}
          <div className="flex-none">
            <NavbarLogo />
          </div>

          {/* HANYA TOMBOL HAMBURGER (Actions sudah dipindah ke dalam) */}
          <div className="flex items-center">
            {/* Trigger Button Slider (Hamburger) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-800 hover:text-[#56BC36] transition-colors"
            >
              <Menu className="w-8 h-8 md:w-7 md:h-7" />
            </button>
          </div>
        </div>

        {/* --- KOMPONEN SLIDER MOBILE --- */}

        {/* Overlay (Layar Hitam Transparan) */}
        <div
          className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Area Slider/Drawer (Kanan ke Kiri) */}
        <div
          className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header Slider: Nama Menu & Tombol Close */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
            <span className="text-xl font-bold text-[#56BC36]">Navigasi</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-8 h-8 text-gray-800" />
            </button>
          </div>

          {/* List Menu di dalam Slider */}
          <nav className="flex flex-col p-6 overflow-y-auto h-[calc(100%-80px)]">

            {/* BAGIAN ACTION (Cart, Login, Register) di dalam Menu Slider */}
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl flex flex-col gap-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Akses Akun</p>
              <NavbarActions />
            </div>

            {NAV_LINKS.map((link, idx) => (
              <div key={idx} className="flex flex-col">
                <NavLink
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-4 px-4 text-lg font-bold border-b border-gray-50 flex items-center justify-between transition-all ${isActive ? 'text-[#56BC36] bg-green-50 rounded-xl' : 'text-gray-800 hover:translate-x-2'
                    }`
                  }
                >
                  {link.label}
                </NavLink>

                {/* Sub Menu (Jika ada) */}
                {link.hasDropdown && link.subItems && (
                  <div className="pl-8 flex flex-col mt-2">
                    {link.subItems.map((sub, sIdx) => (
                      <NavLink
                        key={sIdx}
                        to={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 text-gray-500 font-semibold text-base hover:text-[#56BC36]"
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-10 pt-10 border-t border-gray-100 text-center pb-10">
              <p className="text-gray-400 text-xs font-bold">MISCHE AESTHETIC CLINIC</p>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
