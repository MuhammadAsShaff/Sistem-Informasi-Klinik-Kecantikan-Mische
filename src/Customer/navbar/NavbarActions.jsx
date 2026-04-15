import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavbarActions = () => {
  // btnBaseClass: Kumpulan gaya dasar untuk tombol Agar desainnya seragam (Konsisten)
  // - rounded-full: Membuat tombol bulat kapsul
  // - font-semibold: Ketebalan teks sedang (bukan bold ekstrim)
  // - shadow-xl: Memberikan efek bayangan agar terlihat timbul (Premium)
  const btnBaseClass =
    'rounded-full font-semibold text-white shadow-xl transition-all active:scale-95';
  const btnGreenClass = 'bg-[#56BC36] hover:bg-[#45a42b]';

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-7">
        <button
          className="group flex h-9 w-9 items-center justify-center text-gray-800 transition-colors hover:text-[#56BC36] sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-18 lg:w-18 xl:h-22 xl:w-22"
          aria-label="Shopping Cart"
        >
          <ShoppingCart
            className="h-5 w-5 text-black transition-colors group-hover:text-[#7bc043] sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-12 lg:w-12 xl:h-14 xl:w-14"
          />
        </button>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          <Link
            to="/login"
            className={`${btnBaseClass} ${btnGreenClass} 
              px-4 py-2 text-xs        /* Ukuran HP */
              sm:px-8 sm:py-3.5        /* Ukuran HP Sedang */
              md:px-10 md:py-4 md:text-xl  /* Ukuran Tablet */
              lg:px-12 lg:py-5 lg:text-[24px]  /* Ukuran Laptop (Besar) */
              xl:px-16 xl:py-6 xl:text-[28px]  /* Ukuran Monitor XL */
            `}
          >
            Login
          </Link>
          <Link
            to="/registrasi"
            className={`${btnBaseClass} ${btnGreenClass} 
              px-4 py-2 text-xs 
              sm:px-8 sm:py-3.5 
              md:px-10 md:py-4 md:text-xl 
              lg:px-12 lg:py-5 lg:text-[24px] 
              xl:px-16 xl:py-6 xl:text-[28px]
            `}
          >
            Registrasi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarActions;
