import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
import LogoMische from '@/assets/images/LogoMische.png';
import ModalKonfirmasiLogout from "./ModalKonfirmasiLogout";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // State untuk mengontrol pop-up konfirmasi logout
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // --- 1. MENGAMBIL DATA USER DARI PENYIMPANAN SECARA REAKTIF ---
  const [user, setUser] = useState({ nama: 'Admin', email: 'admin@klinik.com' });

  useEffect(() => {
    const fetchUser = () => {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        setUser(JSON.parse(userDataString));
      }
    };
    
    // Panggil saat pertama kali dimuat
    fetchUser();

    // Dengarkan event perubahan profil agar langsung terupdate
    window.addEventListener('user-profile-updated', fetchUser);

    return () => {
      window.removeEventListener('user-profile-updated', fetchUser);
    };
  }, []);

  // --- 2. FUNGSI LOGOUT ---
  const handleLogout = async () => {
    // Fungsi ini sekarang langsung dieksekusi tanpa window.confirm, 
    // karena konfirmasinya sudah ditangani oleh Modal yang cantik.
    try {
      const token = localStorage.getItem('token');
      // Memanggil endpoint logout dari backend.
      // (Catatan: Untuk logout kita menggunakan endpoint /logout sesuai kode backendmu ya, bukan /reset-password)
      await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    } catch (error) {
      console.error("Gagal mengirim perintah logout ke server:", error);
    } finally {
      // Apapun balasan dari server (sukses atau gagal), kita tetap WAJIB menghapus kunci masuk di komputer ini
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Setelah bersih, arahkan kembali ke halaman login
      navigate('/login');
    }
  };

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
    { name: "Profil Klinik", path: "/admin/profilklinik", icon: <Hospital size={20} /> },
  ];

  return (
    <div className="w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col py-8 overflow-y-auto no-scrollbar shrink-0 shadow-sm fixed left-0 top-0 z-50">
      
      {/* LOGO */}
      <div className="px-10 mb-8 flex justify-center">
        <img src={LogoMische} alt="Mische Logo" className="w-full max-w-[200px] object-contain" />
      </div>

      {/* USER PROFILE */}
      <Link to="/admin/profiladmin" className="flex flex-col items-center mb-10 px-6 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-28 h-28 rounded-full bg-gray-200 shadow-inner mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
           {/* Placeholder for User's photo */}
           <div className="w-full h-full bg-gray-300"></div>
        </div>
        {/* Menampilkan Nama Asli dari Database */}
        <h3 className="text-lg font-black tracking-wider uppercase text-[#1A1A1A] text-center">{user.nama}</h3>
        {/* Menampilkan Email Asli dari Database */}
        <p className="text-xs text-gray-500 font-medium text-center mt-1">{user.email}</p>
      </Link>

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
        <button 
          onClick={() => setIsLogoutModalOpen(true)} // Buka modal saat diklik
          className="flex items-center gap-4 px-6 py-4 w-full text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* POP-UP KONFIRMASI LOGOUT */}
      <ModalKonfirmasiLogout 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Tutup modal jika batal
        onConfirm={handleLogout} // Eksekusi fungsi logout asli jika yakin
      />
    </div>
  );
}
