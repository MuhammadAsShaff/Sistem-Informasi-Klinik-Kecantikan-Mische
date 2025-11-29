import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />  {/* Semua page admin tampil di sini */}
    </>
  );
}
