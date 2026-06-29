import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * ASISTEN PENJAGA BUKU RIWAYAT KLINIK (useFetchProfilKlinik)
 * Ibarat asisten setia yang berdiri di laci penyimpanan buku riwayat dan visi-misi klinik.
 * Asisten ini bertugas memegang salinan riwayat klinik teratas agar langsung bisa dibaca admin, 
 * serta sanggup mengutus kurir mengecek jika ada pergantian jam buka atau telepon di pusat.
 */
export function useFetchProfilKlinik() {
  // Mengutus kurir pencatat (useFetchWithCache) menanyakan arsip riwayat klinik ke server
  const { data, mutate } = useFetchWithCache(endpoints.admin.clinic);
  
  // Baki tempat meletakkan buku riwayat klinik utama
  const [profileData, setProfileData] = useState(null);

  // Saat kurir membawa tumpukan arsip dari pusat, pilih lembar paling atas dan taruh di baki
  useEffect(() => {
    if (data) {
      const clinicData = Array.isArray(data.data || data)
        ? (data.data || data)[0] // Mengambil buku riwayat teratas
        : (data.data || data);
      setProfileData(clinicData && Object.keys(clinicData).length > 0 ? clinicData : null);
    }
  }, [data]);

  // Fungsi untuk memaksa kurir mengambil buku riwayat edisi paling baru
  const fetchProfile = async () => {
    mutate();
  };

  // Asisten menyerahkan buku riwayat dan saklar penyegarnya ke mandor utama
  return { profileData, setProfileData, fetchProfile };
}
