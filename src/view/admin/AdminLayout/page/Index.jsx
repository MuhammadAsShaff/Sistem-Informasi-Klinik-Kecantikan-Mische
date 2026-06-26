import { Outlet } from "react-router-dom";
import AdminNavbar from "../../SideBar/page/Index";

/* 
 * =========================================================================
 * ADMIN LAYOUT (BINGKAI TETAP HALAMAN ADMIN)
 * =========================================================================
 * File ini ibarat "Bingkai Tetap" untuk seluruh halaman Admin.
 * Tujuannya agar Sidebar (Menu di sebelah kiri) tidak perlu dibuat ulang 
 * satu per satu di setiap halaman (seperti halaman Kelola Produk, Kelola Event, dll).
 */

export default function AdminLayout() {
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* 
        1. BINGKAI KIRI (SIDEBAR STATIS) 
        Bagian ini akan selalu diam (statis) tidak ikut terganti atau ter-refresh
      */}
      <AdminNavbar />

      {/* 
        2. BINGKAI KANAN (AREA KONTEN UTAMA) 
        Outlet ini ibarat "Layar Proyektor". Apapun menu yang diklik di Sidebar kiri,
        isinya akan ditampilkan/ditembakkan ke dalam Outlet ini.
        ml-[300px] artinya konten ini digeser ke kanan sejauh 300px agar tidak tertimpa Sidebar.
      */}
      <main className="flex-1 ml-[300px] p-8 md:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
