import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser, clearAuth } from "@/core/utils/authStorage";

/**
 * Hook untuk mengambil & memperbarui profil customer (READ + UPDATE + LOGOUT).
 * Menggunakan authStorage sebagai cache awal agar UI tidak blank saat loading.
 *
 * Tidak ada lagi akses langsung ke localStorage — semua via authStorage.
 *
 * @param {Function} showToast  - Fungsi untuk menampilkan notifikasi
 * @param {Function} navigate   - React Router navigate (untuk redirect logout)
 */
export function useProfilCustomer(showToast, navigate) {
  // Init dari authStorage agar langsung tampil tanpa flash kosong
  const savedUser = getUser() || {};

  const [formData, setFormData] = useState({
    nama:          savedUser.nama          || "",
    alamat:        savedUser.alamat        || "",
    nomorWa:       savedUser.nomorWa       || "",
    email:         savedUser.email         || "",
    tanggalLahir:  savedUser.tanggalLahir  ? savedUser.tanggalLahir.split(" ")[0] : "",
    jenisKelamin:  savedUser.jenisKelamin  || "Perempuan",
  });

  // Background refresh dari server
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get(endpoints.customer.profile);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            nama:         data.nama         || "",
            alamat:       data.alamat        || "",
            nomorWa:      data.nomorWa       || "",
            email:        data.email         || "",
            tanggalLahir: data.tanggalLahir  ? data.tanggalLahir.split(" ")[0] : "",
            jenisKelamin: data.jenisKelamin  || "Perempuan",
          });
        } else {
          showToast(res.data.message || "Gagal mengambil profil", "error");
        }
      } catch (error) {
        console.error("Gagal mengambil profil customer:", error);
        const errMsg = error.response
          ? `Error ${error.response.status}: ${error.response.data?.message || "Gagal"}`
          : "Gagal memuat profil. Pastikan API berjalan dan Anda sudah login.";
        showToast(errMsg, "error");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nomorWa") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await axiosClient.put(endpoints.customer.profile, { ...formData });
      if (res.data.success) {
        showToast("Profil berhasil diperbarui!", "success");
        saveUser(res.data.data); // simpan & dispatch event reaktivitas otomatis
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

  const handleLogout = async () => {
    try {
      await axiosClient.post(endpoints.auth.logout);
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return {
    formData,
    handleChange,
    handleUpdate,
    handleLogout,
  };
}
