import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil data profil klinik dan jumlah dokter (READ - public).
 * Menggunakan axios biasa (tanpa token) karena endpoint ini adalah public.
 */
export function useTentangKami() {
  const [clinicData, setClinicData] = useState(null);
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.clinic}`);
        if (res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
          setClinicData(res.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil profil klinik:", error);
      }
    };

    const fetchDoctorCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.dokter}`);
        if (res.data.success && res.data.data) {
          setDoctorCount(res.data.data.length || 0);
        }
      } catch (error) {
        console.error("Gagal mengambil data dokter:", error);
      }
    };

    fetchClinicInfo();
    fetchDoctorCount();
  }, []);

  // ─── Computed Values ────────────────────────────────────────────
  const deskripsi = clinicData?.deskripsiPerusahaan || "";
  const visi = clinicData?.visi || "";
  const misi = clinicData?.misi || "";

  const jamOperasional =
    clinicData?.jamBuka && clinicData?.jamTutup
      ? `${clinicData.jamBuka.substring(0, 5)} - ${clinicData.jamTutup.substring(0, 5)} WIB`
      : "";

  const imageSrc = clinicData?.fotoPerusahaan
    ? `http://127.0.0.1:8000/storage/${clinicData.fotoPerusahaan}`
    : null; // komponen akan pakai fallback lokal jika null

  return {
    clinicData,
    doctorCount,
    deskripsi,
    visi,
    misi,
    jamOperasional,
    imageSrc,
  };
}
