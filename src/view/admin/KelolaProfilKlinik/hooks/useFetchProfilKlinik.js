import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil data profil klinik (READ).
 */
export function useFetchProfilKlinik() {
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.clinic);
      if (res.data.success && res.data.data) {
        // Antisipasi API mengembalikan Array atau Object
        const clinicData = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;
        setProfileData(clinicData && Object.keys(clinicData).length > 0 ? clinicData : null);
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data klinik:", error.response?.data || error.message);
      setProfileData(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profileData, setProfileData, fetchProfile };
}
