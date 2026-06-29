import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, Ticket, Calendar, LineChart,
  UserRound, Users, ClipboardList, Clock, Tags,
  MessageSquare, Hospital, LogOut
} from "lucide-react";
import LogoMische from "@/assets/images/LogoMische.png";
import { useSideBar } from "../hooks/useSideBar";
import ModalKonfirmasiLogout from "./ModalKonfirmasiLogout";

/**
 * =========================================================================
 * PILAR LORONG NAVIGASI UTAMA (AdminNavbar)
 * =========================================================================
 * Ibarat sebuah pilar kokoh di sebelah kiri balai perkantoran yang menyajikan
 * deretan penunjuk jalan (papan nama divisi). Di atasnya terpasang potret
 * wajah staf yang sedang bertugas, dan di bagian bawahnya terdapat pintu
 * keluar khusus (tombol Logout) jika staf ingin pulang.
 */
export default function AdminNavbar() {
  // ─── MEMINJAM CATATAN & TUAS DARI ASISTEN LORONG (useSideBar) ────────────────
  const { 
    user,                  // Buku rekap paspor dan potret staf
    handleLogout,          // Tombol lonceng eksekusi pamit pulang
    currentPath,           // Nama rute lorong yang sedang dipijak
    isLogoutModalOpen,     // Status rebah/berdirinya plang penahan pintu
    setIsLogoutModalOpen   // Tuas penaik/penurun plang penahan pintu
  } = useSideBar();

  // ─── DAFTAR PAPAN PETUNJUK ARAH DIVISI (MENU ITEMS) ────────────────────────
  // Ibarat deretan papan nama kayu berukir ikon yang menunjuk ke setiap balai kerja di gedung
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Kelola Produk", path: "/admin/produk", icon: <Package size={20} /> },
    { name: "Kelola Promo", path: "/admin/promo", icon: <Ticket size={20} /> },
    { name: "Kelola Event", path: "/admin/event", icon: <Calendar size={20} /> },
    { name: "Data Penjualan", path: "/admin/penjualan", icon: <LineChart size={20} /> },
    { name: "Kelola Profil Dokter", path: "/admin/profildokter", icon: <UserRound size={20} /> },
    { name: "Kelola User", path: "/admin/kelolauser", icon: <Users size={20} /> },
    { name: "Kelola Reservasi Treatment", path: "/admin/reservasi", icon: <ClipboardList size={20} /> },
    { name: "Kelola Jadwal Reservasi Treatment", path: "/admin/jadwal", icon: <Clock size={20} /> },
    { name: "Kelola Kategori Produk", path: "/admin/kategori", icon: <Tags size={20} /> },
    { name: "Testimoni Customer", path: "/admin/testimoni", icon: <MessageSquare size={20} /> },
    { name: "Profil Klinik", path: "/admin/profilklinik", icon: <Hospital size={20} /> },
  ];

  return (
    // ─── STRUKTUR PILAR UTAMA ────────────────────────────────────────────────
    // Pilar setinggi penuh gedung (h-screen), selebar 300 piksel, terpaku permanen di kiri (fixed left-0)
    <div className="w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col py-8 overflow-y-auto no-scrollbar shrink-0 shadow-sm fixed left-0 top-0 z-50">

      {/* ─── UKIRAN LAMBANG KEBANGGAAN MISCHE ───────────────────────────────── */}
      {/* Bingkai atas penyangga potret lambang Mische */}
      <div className="px-10 mb-8 flex justify-center">
        <img src={LogoMische} alt="Mische Logo" className="w-full max-w-[200px] object-contain" />
      </div>

      {/* ─── PAJANGAN POTRET & JABATAN STAF BERTUGAS ────────────────────────── */}
      {/* Tombol pintas: jika dipencet, langsung mengantar staf ke balai ubah profil (/admin/profiladmin) */}
      <Link to="/admin/profiladmin" className="flex flex-col items-center mb-10 px-6 cursor-pointer hover:opacity-80 transition-opacity">
        {/* Bingkai bundar tempat memajang pasfoto staf */}
        <div className="w-28 h-28 rounded-full bg-gray-200 shadow-inner mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
          <img 
            // Pemilih potret cerdik: Cek apakah foto dari luar (http), dari laci storage lokal, atau sketsa wajah bawaan pria/wanita
            src={user?.fotoProfil ? 
                  (user.fotoProfil.startsWith('http') ? user.fotoProfil : `${import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage/'}${String(user.fotoProfil).replace(/^(?:public\/|storage\/|\/)+/, '')}`) 
                  : (user?.jenisKelamin === 'Laki-laki' ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' : '/src/assets/images/ProfilCustomer.png')} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        {/* Ukiran nama tebal berhuruf kapital */}
        <h3 className="text-lg font-black tracking-wider uppercase text-[#1A1A1A] text-center">{user.nama}</h3>
        {/* Tulisan surel staf di bawah nama */}
        <p className="text-xs text-gray-500 font-medium text-center mt-1">{user.email}</p>
      </Link>

      {/* ─── DERETAN PAPAN PETUNJUK DIVISI ──────────────────────────────────── */}
      {/* Rak vertikal penyangga daftar menu lorong */}
      <nav className="flex-1 px-6 space-y-1">
        {menuItems.map((item) => {
          // Menyelidiki apakah papan petunjuk ini adalah lorong yang sedang diinjak staf saat ini
          const isActive = currentPath === item.path;
          return (
            <Link key={item.name} to={item.path}
              // Jika aktif, lapisi papan dengan cat hijau mencolok (#7CC052) dan bayangan bercahaya. Jika tidak, pasang cat putih pudar
              className={`flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                isActive ? "bg-[#7CC052] text-white shadow-lg shadow-green-100" : "text-gray-700 hover:bg-gray-50"
              }`}>
              {/* Tempat ikon dipasang (putih jika aktif, abu-abu jika pasif) */}
              <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
              {/* Nama divisi perkantoran */}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ─── TOMBOL LONCENG PAMIT PULANG (LOGOUT) ───────────────────────────── */}
      {/* Diletakkan di pangkal bawah pilar */}
      <div className="px-6 mt-10">
        <button
          // Saat ditekan, tarik tuas pembuka plang konfirmasi pamit (setIsLogoutModalOpen)
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-4 px-6 py-4 w-full text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all rounded-xl">
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* ─── PAPAN PLANG PENAHAN PINTU (MODAL KONFIRMASI) ───────────────────── */}
      {/* Plang berrompi siaga yang akan melompat menutupi pandangan jika tombol Logout ditekan */}
      <ModalKonfirmasiLogout
        isOpen={isLogoutModalOpen} // Plang mengintip tuas pembuka
        onClose={() => setIsLogoutModalOpen(false)} // Tuas penurun plang (jika urung pulang)
        onConfirm={handleLogout} // Lonceng eksekusi pamit (jika mantap pulang)
      />
    </div>
  );
}

