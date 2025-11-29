
import React from 'react';
import NavbarLogo from './NavbarLogo.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarActions from './NavbarActions.jsx';

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Bagian Kiri */}
        <NavbarLogo />

        {/* Bagian Tengah */}
        <NavbarLinks />

        {/* Bagian Kanan */}
        <NavbarActions />
        
      </div>
    </header>
  );
};

export default Navbar;