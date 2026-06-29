import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/LogoMische.png';

/**
 * =========================================================================
 * PAHATAN LOGO GERBANG (NavbarLogo)
 * =========================================================================
 * Ibarat plakat lambang Mische emas di pintu kaca depan. Jika tamu mengetuk
 * lambang ini, satpam akan langsung menuntun tamu kembali ke teras Alun-Alun
 * Utama (Beranda).
 */
const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <img
        src={Logo}
        alt="Logo Mische"
        className="h-10 w-auto sm:h-12 md:h-20 lg:h-[82px] xl:h-[125px]"
      />
    </Link>
  );
};

export default NavbarLogo;
