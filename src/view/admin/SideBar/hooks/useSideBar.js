import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser, clearAuth, AUTH_UPDATED_EVENT } from "@/core/utils/authStorage";

/**
 * =========================================================================
 * ASISTEN PENJAGA LORONG MENU ADMIN (useSideBar)
 * =========================================================================
 * Ibarat seorang asisten teladan di pilar lorong utama kantor (SideBar).
 * Tugas asisten ini adalah:
 * 1. Mengingat nama, wajah, dan jabatan staf yang sedang bertugas (mengambil dari brankas authStorage).
 * 2. Mencatat rute lorong mana yang sedang dilewati staf saat ini (currentPath).
 * 3. Menyiapkan tombol bel darurat untuk pamit pulang (fitur logout ke server) serta membuka plang konfirmasi pamit.
 */
export function useSideBar() {
  // Alat penunjuk arah untuk memandu langkah staf
  const navigate = useNavigate();
  // Radar pengintai lokasi untuk mengetahui lorong mana yang sedang dipijak staf
  const location = useLocation();
  // Menyimpan nama rute lorong aktif saat ini (misal: /admin/dashboard)
  const currentPath = location.pathname;

  // ─── LACI ARSIP BIODATA STAF & STATUS PLANG ──────────────────────────────────
  // Laci untuk mengingat nama dan surel staf yang sedang bertugas (nilai bawaan: Admin)
  const [user, setUser] = useState({ nama: "Admin", email: "admin@klinik.com" });
  // Tuas penyingkap plang konfirmasi pamit (apakah plang sedang berdiri atau rebah)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  /**
   * ─── ASISTEN PEMBONGKAR BRANKAS (loadUser) ─────────────────────────────────
   * Tugasnya berlari ke brankas authStorage untuk mengambil paspor terbaru staf.
   */
  const loadUser = () => {
    // Membuka brankas untuk mengambil kartu identitas staf
    const saved = getUser();
    // Jika kartu ditemukan, simpan di laci utama
    if (saved) setUser(saved);
  };

  /**
   * ─── PENGAMAT PERUBAHAN PASPOR (useEffect) ────────────────────────────────
   * Menyiapkan kuping tajam untuk mendengarkan pengumuman jika profil staf berubah di ruangan lain.
   */
  useEffect(() => {
    // Saat pertama kali berdiri di lorong, langsung bongkar brankas paspor
    loadUser();
    // Menyalakan kuping radar untuk mendengarkan siaran langsung AUTH_UPDATED_EVENT
    window.addEventListener(AUTH_UPDATED_EVENT, loadUser);
    // Mematikan kuping radar jika asisten pergi agar tidak bising (kebocoran memori)
    return () => window.removeEventListener(AUTH_UPDATED_EVENT, loadUser);
  }, []);

  /**
   * ─── TUGAS MEMBUNYIKAN LONCENG PAMIT PULANG (handleLogout) ────────────────
   * Dipicu saat staf mantap mengonfirmasi keinginan untuk keluar dari gedung kantor.
   */
  const handleLogout = async () => {
    try {
      // Utus kurir Axios berlari membawa surat pamit ke meja direksi pusat (server Laravel)
      await axiosClient.post(endpoints.auth.logout);
    } catch (error) {
      // Jika kurir gagal menaruh surat pamit, catat di buku keluhan, namun tetap izinkan staf pulang
      console.error("Gagal logout dari server:", error);
    } finally {
      // Bersihkan seluruh kunci dan paspor dari brankas saku (clearAuth)
      clearAuth();
      // Pandu mantan staf keluar menuju Pos Gerbang Utama (Login)
      navigate("/login");
    }
  };

  // Serahkan seluruh catatan rute, biodata staf, dan tuas plang kepada Pilar Navigasi (SideBar Index.jsx)
  return { 
    user, 
    handleLogout, 
    currentPath, 
    isLogoutModalOpen, 
    setIsLogoutModalOpen,
    navigate
  };
}

