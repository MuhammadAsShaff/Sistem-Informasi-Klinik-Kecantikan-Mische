import React from 'react';

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
