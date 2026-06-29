import Navbar from "../../NavbarMische/page/Navbar";
import Footer from "../../Footer/page/Footer";
import { Outlet } from "react-router-dom";

/**
 * =========================================================================
 * BENTENG ATAP UTAMA ISTANA CUSTOMER (CustomerLayout)
 * =========================================================================
 * Ibarat kerangka gedung megah tempat seluruh aktivitas tamu berlangsung.
 * Bangunan ini memiliki Atap Pintu Masuk (Navbar) di bagian atas, Alas Fondasi
 * (Footer) di bagian bawah, dan di tengah-tengahnya terdapat ruang panggung serbaguna (Outlet) tempat bergantinya berbagai pameran halaman.
 */
export default function CustomerLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />   {/* Semua page customer tampil di sini */}
      </main>
      <Footer />
    </>
  );
}
