import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavbarActions = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/ProfilCustomer';

  // CEK APAKAH SUDAH LOGIN (Jika ada token dan data user di penyimpanan browser)
  const token = localStorage.getItem('token');
  const userDataString = localStorage.getItem('user');
  let userRole = null;
  
  if (userDataString) {
    try {
      const user = JSON.parse(userDataString);
      userRole = user.role;
    } catch (e) {
      console.error("Gagal membaca data user");
    }
  }

  const isLoggedIn = token !== null && userRole !== null;
  const isAdmin = userRole === 'admin';

  // section button login dan registrasi
  
  const btnBaseClass =
   // mengatur button login dan registrasi mulai dari ketebalan teks
    'rounded-full font-bold text-white shadow-xl transition-all active:scale-95';
    // transition-all Membuat perubahan visual (seperti saat diklik atau di-hover) 
    // active:scale-95 mIni adalah efek interaksi. Ketika tombol diklik/ditekan, ukurannya akan sedikit mengecil (menjadi 95% dari ukuran asli).

    //mengatur warna button login dan registrasi
  const btnGreenClass = 'bg-[#56BC36] hover:bg-[#45a42b]';

  return (
    // section keranjang

    // untuk menetapkan
    <div className="shrink-0">
      {/* shrink-0 ini itu berfungsi untuk memberi perintah kepada browser "Elemen ini tidak boleh mengecil sama sekali, apa pun yang terjadi */}
    

    {/* // untuk mengatur jarak keranjang dengan button */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {/*flex: Fungsinya agar elemen-elemen di dalamnya (seperti ikon keranjang dan kotak tombol) berjejer ke samping (horizontal) secara otomatis.*/}
        {/*items-center : Membuat semua elemen di dalamnya sejajar tepat di tengah secara vertikal (atas-bawah). Jadi, meskipun tinggi ikon dan tinggi tombol berbeda, mereka akan terlihat rapi karena sumbu tengahnya sama.*/}
        
        <button
        // mengatur ukuran area klik keranjang dan warna keranjang
          className="group flex h-9 w-9 items-center justify-center text-gray-800 transition-colors hover:text-[#56BC36] sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-18 lg:w-18 xl:h-22 xl:w-22"
          //
          aria-label="Shopping Cart"
        >
          <ShoppingCart
          // mengatur ukuran gambar keranjang dan warna keranjang
            className="h-5 w-5 text-black transition-colors group-hover:text-[#7bc043] sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-12 lg:w-12 xl:h-14 xl:w-14"
          />
        </button>

      {/* untuk mengatur jarak button login dan registrasi */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {!isLoggedIn ? (
            <>
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
            </>
          ) : isAdmin ? (
            <Link
              to="/admin"
              className={`${btnBaseClass} ${btnGreenClass} 
                px-4 py-2 text-xs 
                sm:px-8 sm:py-3.5 
                md:px-10 md:py-4 md:text-xl 
                lg:px-12 lg:py-5 lg:text-[24px] 
                xl:px-16 xl:py-6 xl:text-[28px]
              `}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/ProfilCustomer"
              className={`${btnBaseClass} ${btnGreenClass} 
                px-4 py-2 text-xs 
                sm:px-8 sm:py-3.5 
                md:px-10 md:py-4 md:text-xl 
                lg:px-12 lg:py-5 lg:text-[24px] 
                xl:px-16 xl:py-6 xl:text-[28px]
              `}
            >
              Profil
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarActions;
