import React from 'react';

const FooterSocial = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-6 text-left">
      <h4 className="text-white text-lg md:text-2xl font-semibold tracking-widest w-fit pb-1">
        Ikuti Kami
      </h4>
      <ul className="flex flex-col gap-2 md:gap-4 text-white text-xs md:text-lg font-semibold">
        <li><a href="#" className="hover:text-[#8cc461] transition-color">Facebook</a></li>
        <li><a href="#" className="hover:text-[#8cc461] transition-color">Instagram</a></li>
        <li><a href="#" className="hover:text-[#8cc461] transition-color">TikTok</a></li>
      </ul>
    </div>
  );
};

export default FooterSocial;
