import Navbar from "../Customer/navbar"; 
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <>
      <Navbar />
      <Outlet />   {/* Semua page customer tampil di sini */}
    </>
  );
}
