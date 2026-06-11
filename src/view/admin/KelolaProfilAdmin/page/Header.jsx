import React from 'react';
import { Pencil } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Pencil size={28} className="text-semibold stroke-[2.5px]" />
      <h1 className="text-2xl font-extrabold text-black tracking-wide">EDIT PROFIL</h1>
    </div>
  );
};

export default Header;
