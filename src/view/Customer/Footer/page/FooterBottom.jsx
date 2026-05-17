import React from 'react';

const FooterBottom = () => {
  return (
    <div className="w-full bg-black py-8 mt-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-white gap-6 uppercase tracking-widest font-bold">
        <p className="flex items-center gap-2">
          <span className="border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white">C</span>
          2024 Mische. All Rights Reserved.
        </p>
        <div className="flex gap-12">
          <a href="#" className="text-white">Terms & Condition</a>
          <a href="#" className="text-white">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
