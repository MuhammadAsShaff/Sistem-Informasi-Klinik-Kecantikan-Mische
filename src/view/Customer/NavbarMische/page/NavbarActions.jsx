import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartContext } from "@/core/context/CartContext";

/**
 * Komponen UI murni untuk aksi navbar (keranjang, tombol auth).
 * Semua data diterima dari props — tidak ada logic / hook di sini.
 *
 * @param {{ isLoggedIn: boolean, isAdmin: boolean }} props
 */
const NavbarActions = ({ isLoggedIn, isAdmin }) => {
  const { cartCount } = useCartContext();
  
  const btnBaseClass =
    "rounded-full font-bold text-white shadow-xl transition-all active:scale-95";
  const btnGreenClass = "bg-[#56BC36] hover:bg-[#45a42b]";
  const btnSizeClass =
    "px-4 py-2 text-xs sm:px-8 sm:py-3.5 md:px-10 md:py-4 md:text-xl lg:px-12 lg:py-5 lg:text-[24px] xl:px-16 xl:py-6 xl:text-[28px]";

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

        {/* Keranjang Belanja */}
        <Link
          to="/keranjang"
          className="group flex h-9 w-9 items-center justify-center text-gray-800 transition-colors hover:text-[#56BC36] sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-18 lg:w-18 xl:h-22 xl:w-22 relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5 text-black transition-colors group-hover:text-[#7bc043] sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4 sm:text-sm">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Tombol Auth */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={`${btnBaseClass} ${btnGreenClass} ${btnSizeClass}`}>
                Login
              </Link>
              <Link to="/registrasi" className={`${btnBaseClass} ${btnGreenClass} ${btnSizeClass}`}>
                Registrasi
              </Link>
            </>
          ) : isAdmin ? (
            <Link to="/admin" className={`${btnBaseClass} ${btnGreenClass} ${btnSizeClass}`}>
              Dashboard
            </Link>
          ) : (
            <Link to="/ProfilCustomer" className={`${btnBaseClass} ${btnGreenClass} ${btnSizeClass}`}>
              Profil
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default NavbarActions;
