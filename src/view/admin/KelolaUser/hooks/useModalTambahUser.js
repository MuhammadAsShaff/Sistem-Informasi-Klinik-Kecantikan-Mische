import { useState } from "react";
import { CITIES } from "@/core/utils/rajaOngkirData";

/**
 * =========================================================================
 * ASISTEN PENGAWAL MEJA PENDAFTARAN ANGGOTA BARU (useModalTambahUser)
 * =========================================================================
 * Ibarat asisten siaga yang membagikan kertas isian putih bersih di meja pendaftaran.
 * Asisten ini meminjam pena dan formulir dari Kurir Pendaftaran (useTambahUser),
 * serta menyiapkan atlas peta pintar untuk memunculkan daftar kota begitu pimpinan memilih provinsi.
 */
export const useModalTambahUser = (hook) => {
  // Mengambil pena, laci isian, dan saklar senter dari Asisten Kurir Pendaftaran
  const { formData, setFormData, showPassword, setShowPassword, handleChange, handleSubmit } = hook;

  // Laci penyimpan daftar kota/kabupaten sesuai provinsi yang dipilih
  const [localCities, setLocalCities] = useState([]);

  /**
   * TUGAS MEMBUKA ATLAS KOTA (fetchCities)
   * Ketika pimpinan menunjuk provinsi, asisten membuka peta dan memaparkan kota-kotanya.
   */
  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setLocalCities([]);
      return;
    }
    setLocalCities(CITIES[provinceId] || []);
  };

  // Asisten menyerahkan seluruh pena dan laci kota kepada meja pendaftaran (view)
  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    localCities,
    fetchCities
  };
};
