import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveUser } from "@/core/utils/authStorage";

/**
 * Hook untuk mengelola form edit profil admin (UPDATE data profil).
 * Termasuk: state form, populate dari user, handleChange, dan submit.
 *
 * Tidak ada lagi akses langsung ke localStorage — semua via authStorage.
 *
 * @param {Object|null} user       - Data user yang sedang login
 * @param {Function}    showToast  - Fungsi untuk menampilkan notifikasi
 * @param {Function}    onUpdated  - Callback dengan data user terbaru setelah berhasil update
 */
export function useUpdateProfilAdmin(user, showToast, onUpdated) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    tanggalLahir: "",
    jenisKelamin: "",
    nomorWa: "",
    alamat: "",
  });

  // Populate form saat data user tersedia / berubah
  useEffect(() => {
    if (user) {
      setFormData({
        nama:         user.nama         || "",
        email:        user.email        || "",
        tanggalLahir: user.tanggalLahir ? user.tanggalLahir.split(" ")[0] : "",
        jenisKelamin: user.jenisKelamin || "",
        nomorWa:      user.nomorWa      || "",
        alamat:       user.alamat       || "",
      });
    }
  }, [user]);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const { convertToJPEG } = await import("@/utils/imageConverter");
        const convertedFile = await convertToJPEG(file);
        setFormData((prev) => ({ ...prev, [name]: convertedFile }));
      }
    } else if (name === "nomorWa") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSimpan = async () => {
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && key !== "password") {
          // If fotoProfil is a string (e.g. existing URL), don't send it. Only send File objects.
          if (key === "fotoProfil" && typeof formData[key] === "string") {
            return;
          }
          payload.append(key, formData[key]);
          if (key === "fotoProfil") {
            payload.append("foto_profil", formData[key]);
            payload.append("foto", formData[key]); // Just in case it expects 'foto'
          }
        }
      });
      payload.append("_method", "PUT");

      const res = await axiosClient.post(endpoints.admin.profile, payload);

      if (res.data.success) {
        const updatedUser = res.data.data;
        showToast("Profil berhasil diperbarui!", "success");
        saveUser(updatedUser); // simpan & dispatch event reaktivitas otomatis
        onUpdated && onUpdated(updatedUser);
      }
    } catch (error) {
      let errorMsg = "Gagal memperbarui profil.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg, "error");
    }
  };

  return {
    formData,
    handleChange,
    handleSimpan,
  };
}
