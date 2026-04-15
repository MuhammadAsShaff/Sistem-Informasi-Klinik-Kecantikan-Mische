import { Outlet } from "react-router-dom";
import AdminNavbar from "./Navbar/Index";

export default function AdminLayout() {
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* Sidebar Statis di Kiri */}
      <AdminNavbar />

      {/* Area Konten Utama di Kanan */}
      <main className="flex-1 ml-[300px] p-8 md:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
