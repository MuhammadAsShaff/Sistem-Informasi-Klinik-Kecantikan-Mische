import Navbar from "../../NavbarMische/page/Navbar";
import Footer from "../../Footer/page/Footer";
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
