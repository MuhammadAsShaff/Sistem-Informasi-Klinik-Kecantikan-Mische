import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengelola form edit/perbarui user (UPDATE).
 * @param {Object|null} userData - Data user yang sedang diedit
 * @param {Function} onSuccess - Callback dipanggil setelah update berhasil
 * @param {Function} showToast - Fungsi untuk menampilkan notifikasi
 */
export function useEditUser(userData, onSuccess, showToast) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "", // Kosong = tidak diubah
    jenisKelamin: "",
    alamat: "",
    role: "",
    tanggalLahir: "",
    nomorWa: "",
    alamat_lengkap: [],
  });
  const [showPassword, setShowPassword] = useState(false);

  // Populate form saat userData berubah (tombol Edit ditekan)
  useEffect(() => {
    if (userData) {
      setFormData({
        nama: userData.nama || "",
        email: userData.email || "",
        password: "", // Kosongkan agar hanya diisi jika ingin diubah
        jenisKelamin:
          userData.jenisKelamin ||
          userData.gender ||
          userData.jenis_kelamin ||
          "",
        alamat: userData.alamat || "",
        role: userData.role || "",
        tanggalLahir:
          userData.tanggalLahir ||
          userData.birth ||
          userData.tanggal_lahir ||
          "",
        nomorWa:
          userData.nomorWa ||
          userData.whatsapp ||
          userData.nomor_whatsapp ||
          userData.no_wa ||
          "",
        alamat_lengkap: userData.alamat_lengkap || userData.alamats || [],
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nomor WA hanya boleh angka
    if (name === "nomorWa") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!userData) return;
    try {
      const idUser = userData.idUser || userData.id;
      await axiosClient.put(`${endpoints.admin.users}/${idUser}`, formData);
      showToast("Berhasil memperbarui user", "success");
      onSuccess();
    } catch (error) {
      console.error("Gagal memperbarui user:", error);
      let errorMessage = "Gagal memperbarui data user.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
