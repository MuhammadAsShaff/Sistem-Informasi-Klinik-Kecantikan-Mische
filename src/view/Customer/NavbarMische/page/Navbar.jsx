import React from 'react';

// ── UI Components (murni, tidak ada logic) ──────────────────────────────────
import NavbarDesktop from './NavbarDesktop';
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
      
      {/* DESKTOP VIEW */}
      <NavbarDesktop 
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />

      {/* MOBILE VIEW */}
      <NavbarMobile
        isOpen={isMobileMenuOpen}
        onOpen={openMobileMenu}
        onClose={closeMobileMenu}
        links={navLinks}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />

    </header>
  );
};

export default Navbar;
