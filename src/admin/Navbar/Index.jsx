import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Ticket, 
  Calendar, 
  LineChart, 
  UserRound, 
  Users, 
  ClipboardList, 
  Clock, 
  Tags, 
  MessageSquare, 
  Hospital, 
  LogOut 
} from "lucide-react";
import LogoMische from "../../assets/LogoMische.png";

export default function AdminNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Kelola Produk", path: "/admin/produk", icon: <Package size={20} /> },
    { name: "Kelola Promo", path: "/admin/promo", icon: <Ticket size={20} /> },
    { name: "Kelola Event", path: "/admin/event", icon: <Calendar size={20} /> },
    { name: "Data Penjualan", path: "/admin/penjualan", icon: <LineChart size={20} /> },
    { name: "Kelola Profil Dokter", path: "/admin/profil-dokter", icon: <UserRound size={20} /> },
    { name: "Kelola User", path: "/admin/kelolauser", icon: <Users size={20} /> },
    { name: "Kelola Reservasi Treatment", path: "/admin/reservasi", icon: <ClipboardList size={20} /> },
    { name: "Kelola Jadwal Reservasi Treatment", path: "/admin/jadwal", icon: <Clock size={20} /> },
    { name: "Kelola Kategori Produk", path: "/admin/kategori", icon: <Tags size={20} /> },
    { name: "Testimoni Customer", path: "/admin/testimoni", icon: <MessageSquare size={20} /> },
    { name: "Profil Klinik", path: "/admin/profil-klinik", icon: <Hospital size={20} /> },
  ];

  return (
    <div className="w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col py-8 overflow-y-auto no-scrollbar shrink-0 shadow-sm fixed left-0 top-0">
      
      {/* LOGO */}
      <div className="px-10 mb-8 flex justify-center">
        <img src={LogoMische} alt="Mische Logo" className="w-full max-w-[200px] object-contain" />
      </div>

      {/* USER PROFILE */}
      <div className="flex flex-col items-center mb-10 px-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 shadow-inner mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
           {/* Placeholder for Bintang's photo */}
           <div className="w-full h-full bg-gray-300"></div>
        </div>
        <h3 className="text-lg font-black tracking-wider uppercase text-[#1A1A1A]">BINTANG</h3>
        <p className="text-xs text-gray-500 font-medium">Bintang22si@mahasiswa.pcr.ac.id</p>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? "bg-[#7CC052] text-white shadow-lg shadow-green-100" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-6 mt-10">
        <button className="flex items-center gap-4 px-6 py-4 w-full text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all rounded-xl">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
