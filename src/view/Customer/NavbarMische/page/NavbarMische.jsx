import React from 'react';
import { Menu } from 'lucide-react';

// ── UI Components (murni, tidak ada logic) ──────────────────────────────────
import NavbarLogo    from './NavbarLogo';
import NavbarLinks   from './NavbarLinks';
import NavbarActions from './NavbarActions';
import NavbarMobile  from './NavbarMobile';

// ── Hooks (semua logic terpusat di sini) ────────────────────────────────────
import { useNavbarAuth }   from '../hooks/useNavbarAuth';
import { useNavbarMobile } from '../hooks/useNavbarMobile';
import { useNavbarLinks }  from '../hooks/useNavbarLinks';

/**
 * Orkestrator Navbar.
 *
 * Komponen ini HANYA bertugas:
 *   1. Memanggil semua hooks (logic)
 *   2. Mendistribusikan data hasil hooks ke komponen UI via props
 *
 * Tidak ada state, side-effect, atau business logic di sini.
 */
const Navbar = () => {
  // ── Logic Hooks ───────────────────────────────────────────────────────────
  const { isLoggedIn, isAdmin }              = useNavbarAuth();
  const { isMobileMenuOpen, openMobileMenu,
          closeMobileMenu }                  = useNavbarMobile();
  const { navLinks }                         = useNavbarLinks();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">

      {/* ================================================================== */}
      {/* 1. DESKTOP VIEW                                                     */}
      {/* ================================================================== */}
      <div className="hidden md:block w-full">
        <div className="flex w-full items-center justify-between px-4 md:h-[80px] lg:h-[100px] lg:px-8 xl:h-[90px] xl:px-10">

          <div className="flex-none">
            <NavbarLogo />
          </div>

          <div className="flex-1 justify-center flex">
            <NavbarLinks links={navLinks} />
          </div>

          <div className="flex-none">
            <NavbarActions isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          </div>

        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. MOBILE VIEW                                                      */}
      {/* ================================================================== */}
      <div className="block md:hidden w-full">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:h-[84px] sm:px-6">

          {/* LOGO */}
          <div className="flex-none">
            <NavbarLogo />
          </div>

          {/* TOMBOL HAMBURGER */}
          <div className="flex items-center">
            <button
              onClick={openMobileMenu}
              className="p-2 text-gray-800 hover:text-[#56BC36] transition-colors"
            >
              <Menu className="w-8 h-8 md:w-7 md:h-7" />
            </button>
          </div>

        </div>

        {/* DRAWER MOBILE (UI terpisah) */}
        <NavbarMobile
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          links={navLinks}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
        />
      </div>

    </header>
  );
};

export default Navbar;
