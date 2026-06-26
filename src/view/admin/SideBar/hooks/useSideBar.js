import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser, clearAuth, AUTH_UPDATED_EVENT } from "@/core/utils/authStorage";

/**
 * Hook untuk sidebar admin.
 * Mengelola data user (nama & email) secara reaktif dari authStorage
 * dan fungsi logout ke backend.
 *
 * Tidak ada lagi akses langsung ke localStorage — semua via authStorage.
 */
export function useSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [user, setUser] = useState({ nama: "Admin", email: "admin@klinik.com" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const loadUser = () => {
    const saved = getUser();
    if (saved) setUser(saved);
  };

  useEffect(() => {
    loadUser();
    // Update otomatis saat profil diperbarui dari halaman lain
    window.addEventListener(AUTH_UPDATED_EVENT, loadUser);
    return () => window.removeEventListener(AUTH_UPDATED_EVENT, loadUser);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosClient.post(endpoints.auth.logout);
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return { 
    user, 
    handleLogout, 
    currentPath, 
    isLogoutModalOpen, 
    setIsLogoutModalOpen,
    navigate
  };
}
