import React from 'react';
import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarActions from './NavbarActions';

/**
 * =========================================================================
 * MEJA RESEPSIONIS PANJANG (NavbarDesktop)
 * =========================================================================
 * Ibarat meja resepsionis marmer panjang di gedung utama untuk tamu yang datang
 * membawa layar besar (laptop/komputer). Di sini Lambang Klinik, Deretan Peta
 * Arah, dan Rak Troli dipajang berjajar tanpa perlu ditekuk atau dilipat.
 */
const NavbarDesktop = ({ navLinks, isLoggedIn, isAdmin, cartCount }) => {
  return (
    <div className="hidden md:block w-full">
      <div className="flex w-full items-center justify-between px-4 md:h-[80px] lg:h-[100px] lg:px-8 xl:h-[90px] xl:px-10">
        
        <div className="flex-none">
          <NavbarLogo />
        </div>

        <div className="flex-1 justify-center flex">
          <NavbarLinks links={navLinks} />
        </div>

        <div className="flex-none">
          <NavbarActions isLoggedIn={isLoggedIn} isAdmin={isAdmin} cartCount={cartCount} />
        </div>

      </div>
    </div>
  );
};

export default NavbarDesktop;
