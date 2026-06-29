import React from 'react';

/**
 * =========================================================================
 * LAMBANG TUGU KLINIK (FooterLogo)
 * =========================================================================
 * Ibarat pahatan lambang besar berlogo Mische di taman depan gedung, yang
 * memancarkan identitas resmi klinik kepada setiap orang yang melintas.
 */
const FooterLogo = ({ logo }) => {
  return (
    <div className="flex flex-col items-center md:items-start justify-center">
      <img 
        src={logo} 
        alt="Logo Mische" 
        className="h-16 md:h-32 w-auto"
      />
    </div>
  );
};

export default FooterLogo;
