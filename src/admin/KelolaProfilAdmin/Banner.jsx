import React from 'react';

const Banner = ({ user }) => {
  const nama = user?.nama || 'Admin Utama';

  return (
    <div className="w-full border border-gray-300 p-6 flex flex-row items-center gap-6 mb-12 bg-white rounded-md">
      <div className="w-[100px] h-[100px] rounded-full bg-[#d2d6dd] flex-shrink-0 flex items-center justify-center overflow-hidden">
         {/* Placeholder avatar */}
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-[85px] h-[85px] text-white mt-6">
             <path fillRule="evenodd" d="M12 2.25c-2.899 0-5.25 2.351-5.25 5.25 0 2.899 2.351 5.25 5.25 5.25s5.25-2.351 5.25-5.25c0-2.899-2.351-5.25-5.25-5.25zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" clipRule="evenodd" />
         </svg>
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="bg-[#e1f5ec] text-[#48a176] font-semibold px-5 py-1 rounded-full text-[14px] mb-2">
          Online
        </span>
        <h2 className="text-[22px] font-bold text-black mb-1">Hallo, {nama}!</h2>
        <p className="text-gray-700 text-[15px]">
          Anda dapat mengganti dan menyesuaikan dengan kebutuhan. Ayo atur profil Anda sekarang!
        </p>
      </div>
    </div>
  );
};

export default Banner;
