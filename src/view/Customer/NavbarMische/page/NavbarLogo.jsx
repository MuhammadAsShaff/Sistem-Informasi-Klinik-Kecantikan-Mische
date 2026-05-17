import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/LogoMische.png';

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
