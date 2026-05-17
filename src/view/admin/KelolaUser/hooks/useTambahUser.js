import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

const INITIAL_FORM = {
  nama: "",
  email: "",
  password: "",
  jenisKelamin: "",
  alamat: "",
  role: "",
  tanggalLahir: "",
  nomorWa: "",
};

/**
 * Hook untuk mengelola form tambah user baru (CREATE).
 * @param {Function} onSuccess - Callback dipanggil setelah user berhasil ditambah
 * @param {Function} showToast - Fungsi untuk menampilkan notifikasi
 */
export function useTambahUser(onSuccess, showToast) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      await axiosClient.post(endpoints.admin.users, formData);
      showToast("User berhasil ditambahkan!");
      setFormData(INITIAL_FORM); // Reset form setelah sukses
      onSuccess();
    } catch (error) {
      console.error("Gagal menambah user:", error);
      let errorMessage = "Gagal menambahkan user. Silakan coba lagi.";
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
  };
}
