import React from 'react';
import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import NavbarActions from './NavbarActions';

/**
 * Komponen UI murni untuk drawer/slider navigasi mobile.
 * Semua state & data diterima dari props — tidak ada logic di sini.
 *
 * @param {{
 *   isOpen        : boolean,
 *   onClose       : () => void,
 *   links         : Array,
 *   isLoggedIn    : boolean,
 *   isAdmin       : boolean,
 * }} props
 */
const NavbarMobile = ({ isOpen, onClose, links = [], isLoggedIn, isAdmin }) => {
  return (
    <>
      {/* Overlay (Layar Hitam Transparan) */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Area Slider/Drawer (Kanan ke Kiri) */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Slider: Judul & Tombol Close */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <span className="text-xl font-bold text-[#56BC36]">Navigasi</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-gray-800" />
          </button>
        </div>

        {/* Konten List Menu */}
        <nav className="flex flex-col p-6 overflow-y-auto h-[calc(100%-80px)]">

          {/* BAGIAN ACTION (Cart, Login, Register) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
              Akses Akun
            </p>
            <NavbarActions isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          </div>

          {/* Daftar Link Navigasi */}
          {links.map((link, idx) => (
            <div key={idx} className="flex flex-col">
              <NavLink
                to={link.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `py-4 px-4 text-lg font-bold border-b border-gray-50 flex items-center justify-between transition-all ${
                    isActive
                      ? 'text-[#56BC36] bg-green-50 rounded-xl'
                      : 'text-gray-800 hover:translate-x-2'
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
                      onClick={onClose}
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
    </>
  );
};

export default NavbarMobile;
