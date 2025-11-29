// src/components/Navbar/NavbarActions.jsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';

const NavbarActions = () => {
  const btnBaseClass = "px-6 py-2 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-sm text-white";
  const btnGreenClass = "bg-[#7bc043] hover:bg-[#6aa838]";

  return (
    <div className="flex items-center gap-5">
      {/* Icon Cart */}
      <button className="relative group" aria-label="Shopping Cart">
        <ShoppingCart size={24} className="text-black group-hover:text-[#7bc043] transition-colors" />
      </button>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <button className={`${btnBaseClass} ${btnGreenClass}`}>
          Login
        </button>
        <button className={`${btnBaseClass} ${btnGreenClass}`}>
          Registrasi
        </button>
      </div>
    </div>
  );
};

export default NavbarActions;