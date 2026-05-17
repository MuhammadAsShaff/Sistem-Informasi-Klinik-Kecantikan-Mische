import React from 'react';

const FooterHours = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-6 text-left">
      <h4 className="text-white text-lg md:text-2xl font-semibold tracking-widest w-fit pb-1">
        Waktu Operasional
      </h4>
      <div className="text-white text-xs md:text-lg flex flex-col gap-1 md:gap-2 font-medium">
        <p>Setiap Hari</p>
        <p>09.00 - 20.00</p>
      </div>
    </div>
  );
};

export default FooterHours;
