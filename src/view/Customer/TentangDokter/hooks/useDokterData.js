import { useMemo } from "react";
import { endpoints, STORAGE_BASE_URL } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * MANDOR KEPALA ARSIP DAFTAR DOKTER (useDokterData)
 * =========================================================================
 * Ibarat kepala HRD klinik yang menyimpan seluruh berkas kepegawaian dokter:
 * 1. Mengambil foto dan jadwal dari brankas pusat (API backend).
 * 2. Memastikan foto dokter memiliki alamat lengkap agar terpampang jelas.
 * 3. Memberi petunjuk cepat saat ada yang menanyakan biodata dokter tertentu.
 */
export const useDokterData = () => {
  const { data: rawData, isLoading: isCacheLoading } = useFetchWithCache(endpoints.customer.dokter, {
    ttl: 15000,
    revalidateOnMount: false 
  });

  const doctors = useMemo(() => {
    if (!rawData) return [];
    const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);
    return dataArray.map(doc => ({
      ...doc,
      foto: doc.foto && !doc.foto.startsWith('http') ? `${STORAGE_BASE_URL}${String(doc.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}` : doc.foto
    }));
  }, [rawData]);

  const getDoctorById = (id) => {
    return doctors.find((doc) => doc.idDokter?.toString() === id.toString() || doc.id?.toString() === id.toString());
  };

  return {
    doctors,
    isLoading: isCacheLoading,
    getDoctorById,
  };
};
