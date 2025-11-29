
import React from 'react';
import { Leaf } from 'lucide-react';
import Logo from '../../assets/LogoMische.png';


const NavbarLogo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <img src={Logo} alt="Logo Mische" className="h-10 w-auto" />
    </div>
  );
};

export default NavbarLogo;

//