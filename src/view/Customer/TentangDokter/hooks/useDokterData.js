import { useState, useEffect } from "react";
import axios from "axios";
import { endpoints, API_BASE_URL, STORAGE_BASE_URL } from "@/core/api/endpoints";

export const useDokterData = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPublicDoctors = async () => {
    setIsLoading(true);
    try {
      // Menggunakan axios biasa tanpa axiosClient (krn public tidak butuh token)
      const res = await axios.get(`${API_BASE_URL}${endpoints.customer.dokter}`);
      if (res.data?.data) {
        const formattedDoctors = res.data.data.map(doc => ({
          ...doc,
          foto: doc.foto && !doc.foto.startsWith('http') ? `${STORAGE_BASE_URL}${doc.foto}` : doc.foto
        }));
        setDoctors(formattedDoctors);
      } else {
        const rawDoctors = res.data || [];
        const formattedDoctors = rawDoctors.map(doc => ({
          ...doc,
          foto: doc.foto && !doc.foto.startsWith('http') ? `${STORAGE_BASE_URL}${doc.foto}` : doc.foto
        }));
        setDoctors(formattedDoctors);
      }
    } catch (error) {
      console.error("Gagal mengambil data dokter publik:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDoctors();
  }, []);

  const getDoctorById = (id) => {
    return doctors.find((doc) => doc.idDokter?.toString() === id.toString() || doc.id?.toString() === id.toString());
  };

  return {
    doctors,
    isLoading,
    getDoctorById,
  };
};
