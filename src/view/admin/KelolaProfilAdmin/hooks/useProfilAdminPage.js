import { useState } from "react";
import { useFetchProfilAdmin } from "./useFetchProfilAdmin";
import { useUpdateProfilAdmin } from "./useUpdateProfilAdmin";

/**
 * MANDOR UTAMA HALAMAN KELOLA PROFIL (useProfilAdminPage)
 * Ibarat manajer utama yang berdiri di ruangan pengubahan KTP/biodata admin. 
 * Manajer ini memimpin dua asisten penting: Asisten pembawa biodata lama (useFetchProfilAdmin) 
 * dan Juru tulis pengubah biodata baru (useUpdateProfilAdmin). Manajer ini juga memegang TOA 
 * untuk mengumumkan apakah penyimpanan biodata berhasil atau gagal.
 */
export const useProfilAdminPage = () => {
  // 1. SISTEM PENGUMUMAN (TOAST ALERT)
  // Ibarat TOA pengumuman singkat yang berbunyi "Profil berhasil disimpan!"
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // 2. MEMANGGIL ASISTEN PEMBAWA BIODATA LAMA
  // Asisten ini menyodorkan biodata admin yang sedang aktif
  const { userData, setUserData, isLoading } = useFetchProfilAdmin();

  // 3. MEMANGGIL JURU TULIS PENGUBAH BIODATA
  // Juru tulis ini memegang formulir baru, siap mengoreksi nama, email, atau foto profil
  const profilHook = useUpdateProfilAdmin(
    userData,
    showToast,
    (updatedUser) => setUserData(updatedUser) // Jika berhasil disimpan, segera perbarui foto/nama di layar
  );

  // Manajer menyerahkan seluruh catatan dan alat ini ke halaman utama
  return {
    toast,
    setToast,
    showToast,
    userData,
    setUserData,
    isLoading,
    profilHook
  };
};
