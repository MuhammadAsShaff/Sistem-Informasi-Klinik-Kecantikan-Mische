import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser } from "@/core/utils/authStorage";

/**
 * Hook untuk mengambil data profil admin yang sedang login (READ).
 * Langsung tampilkan data dari authStorage untuk menghindari layar kosong,
 * lalu sinkronkan dengan data terbaru dari server.
 *
 * Tidak ada lagi akses langsung ke localStorage — semua via authStorage.
 */
export function useFetchProfilAdmin() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Tampilkan data cached terlebih dahulu agar UI tidak blank
    const cached = getUser();
    if (cached) setUserData(cached);

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.profile);
      if (res.data.success) {
        const data = res.data.data;
        setUserData(data);
        saveUser(data); // simpan & dispatch event reaktivitas otomatis
      }
    } catch (error) {
      console.error("Gagal mengambil profil admin:", error);
    }
  };

  return {
    userData,
    setUserData,
    fetchProfile,
  };
}
