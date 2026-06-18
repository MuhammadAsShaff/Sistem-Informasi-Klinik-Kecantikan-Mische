import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * Hook untuk mengambil data profil klinik (READ).
 */
export function useFetchProfilKlinik() {
  const { data, mutate } = useFetchWithCache(endpoints.admin.clinic);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (data) {
      const clinicData = Array.isArray(data.data || data)
        ? (data.data || data)[0]
        : (data.data || data);
      setProfileData(clinicData && Object.keys(clinicData).length > 0 ? clinicData : null);
    }
  }, [data]);

  const fetchProfile = async () => {
    mutate();
  };

  return { profileData, setProfileData, fetchProfile };
}
