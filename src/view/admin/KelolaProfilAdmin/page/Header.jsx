import React from 'react';
import { Pencil } from 'lucide-react';

/**
 * PAPAN PLANG NAMA (Header)
 * Ibarat plang nama kokoh bernuansa tebal di dinding atas ruangan yang disertai simbol 
 * ukiran pensil. Tujuannya memberi tahu setiap orang bahwa mereka sedang berada di ruangan 
 * khusus untuk "EDIT PROFIL".
 */
const Header = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      {/* Simbol Ukiran Pensil */}
      <Pencil size={28} className="text-semibold stroke-[2.5px]" />
      
      {/* Tulisan Papan Nama Ruangan */}
      <h1 className="text-2xl font-extrabold text-black tracking-wide">EDIT PROFIL</h1>
    </div>
  );
};

export default Header;
