import Navbar from "./NavbarMische/NavbarMische";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

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
