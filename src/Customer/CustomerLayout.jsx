import Navbar from "../Customer/navbar"; 
import Footer from "../Customer/Footer";
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
