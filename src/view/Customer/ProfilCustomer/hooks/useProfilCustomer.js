import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getUser, saveUser, clearAuth } from "@/core/utils/authStorage";
import { useFetchWithCache, invalidateCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * MANDOR KELOLA KARTU IDENTITAS KONSUMEN (useProfilCustomer)
 * =========================================================================
 * Ibarat mandor pencatat buku induk keanggotaan di meja resepsionis utama:
 * 1. Menjaga dan memoles profil tamu agar selalu mutakhir (SWR cache).
 * 2. Mencatat perubahan nomor WhatsApp, nama, dan tanggal lahir.
 * 3. Membantu proses kepulangan tamu dari lobi klinik (Logout).
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

  // Background refresh dari server menggunakan SWR dengan TTL pendek
  const { error } = useFetchWithCache(endpoints.customer.profile, {
    onSuccess: (data) => {
      setFormData({
        nama:         data.nama         || "",
        alamat:       data.alamat        || "",
        nomorWa:      data.nomorWa       || "",
        email:        data.email         || "",
        tanggalLahir: data.tanggalLahir  ? data.tanggalLahir.split(" ")[0] : "",
        jenisKelamin: data.jenisKelamin  || "Perempuan",
      });
      // Sync authStorage if there are server updates
      if (data.nama && data.email) {
        saveUser(data); 
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error("Gagal mengambil profil customer:", error);
      const errMsg = error.response
        ? `Error ${error.response.status}: ${error.response.data?.message || "Gagal"}`
        : "Gagal memuat profil. Pastikan API berjalan dan Anda sudah login.";
      showToast(errMsg, "error");
    }
  }, [error, showToast]);

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
        invalidateCache(endpoints.customer.profile); // invalidate SWR cache
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
      invalidateCache(''); // Clear all caches on logout
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
