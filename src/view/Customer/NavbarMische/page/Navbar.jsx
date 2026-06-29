import React from 'react';

// ── UI Components (murni, tidak ada logic) ──────────────────────────────────
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile  from './NavbarMobile';

// ── Hooks (semua logic terpusat di sini) ────────────────────────────────────
import { useNavbarAuth }   from '../hooks/useNavbarAuth';
import { useNavbarMobile } from '../hooks/useNavbarMobile';
import { useNavbarLinks }  from '../hooks/useNavbarLinks';
import { useCartContext }  from '@/core/context/CartContext';

/**
 * =========================================================================
 * MANDOR KEPALA POS KENDALI NADI (Navbar)
 * =========================================================================
 * Ibarat komandan pos satpam di gerbang depan gedung klinik:
 * 1. Mengumpulkan semua laporan dari Mandor Loket (useNavbarAuth), Mandor Pintu Lipat (useNavbarMobile), dan Buku Petunjuk Arah (useNavbarLinks).
 * 2. Meneruskan perintah ke para penjaga pintu di meja besar (NavbarDesktop) dan meja kecil (NavbarMobile).
 * 3. Tidak melakukan pekerjaan kotor sendiri, hanya menjadi jembatan penghubung yang tenang dan bijaksana.
 */
const Navbar = () => {
  // ── Logic Hooks ───────────────────────────────────────────────────────────
  const { isLoggedIn, isAdmin }              = useNavbarAuth();
  const { isMobileMenuOpen, openMobileMenu,
          closeMobileMenu }                  = useNavbarMobile();
  const { navLinks }                         = useNavbarLinks();
  const { cartCount }                        = useCartContext();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">
      
      {/* DESKTOP VIEW */}
      <NavbarDesktop 
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        cartCount={cartCount}
      />

      {/* MOBILE VIEW */}
      <NavbarMobile
        isOpen={isMobileMenuOpen}
        onOpen={openMobileMenu}
        onClose={closeMobileMenu}
        links={navLinks}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        cartCount={cartCount}
      />

    </header>
  );
};

export default Navbar;
