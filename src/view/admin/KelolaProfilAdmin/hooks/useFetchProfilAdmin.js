import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser } from "@/core/utils/authStorage";

/**
 * ASISTEN PENCATAT IDENTITAS ADMIN (useFetchProfilAdmin)
 * Ibarat asisten pribadi yang memegang buku riwayat biodata admin (nama, foto, nomor WA).
 * Agar layar tidak kosong saat pertama kali dibuka, asisten ini langsung menyodorkan catatan 
 * lama yang ada di laci meja (authStorage), sambil diam-diam menyuruh kurir menanyakan biodata 
 * terbaru ke kantor pusat (server).
 */
export function useFetchProfilAdmin() {
  // Tempat menaruh data biodata admin yang siap dipajang di layar
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 1. LANGSUNG CEK LACI MEJA (Mencegah layar kosong/blank)
    // Ambil salinan KTP/biodata lama yang ada di laci meja (authStorage)
    const cached = getUser();
    if (cached) setUserData(cached);

    // 2. TANYAKAN KE KANTOR PUSAT
    // Suruh kurir berangkat untuk mencocokkan apakah ada data terbaru di kantor pusat
    fetchProfile();
  }, []);

  // Fungsi khusus untuk menugaskan kurir meminta biodata terbaru dari kantor pusat
  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.profile);
      if (res.data.success) {
        const data = res.data.data;
        setUserData(data); // Pasang data terbaru di layar
        saveUser(data); // Simpan salinannya ke dalam laci meja agar selalu terbarui
      }
    } catch (error) {
      console.error("Gagal mengambil profil admin:", error);
    }
  };

  // Asisten menyodorkan data biodata ini ke halaman utama
  return {
    userData,
    setUserData,
    fetchProfile,
  };
}
