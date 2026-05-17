import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const INITIAL_FORM = {
  nama: "",
  email: "",
  nomorWa: "",
  alamat: "",
  jenisKelamin: "",
  tanggalLahir: "",
  password: "",
  confirmPassword: "",
};

/**
 * Hook untuk mengelola form registrasi (CREATE akun baru).
 * Termasuk: state form, validasi password, dan submit ke API.
 *
 * @param {Function} navigate  - React Router navigate untuk redirect setelah berhasil
 * @param {Function} showToast - Fungsi untuk menampilkan notifikasi
 */
export function useRegistrasi(navigate, showToast) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nomor WA hanya angka
    if (name === "nomorWa") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    if (!PASSWORD_REGEX.test(formData.password)) {
      showToast("Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Konfirmasi password tidak cocok!", "error");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData; // Hapus confirmPassword dari payload
      const res = await axiosClient.post(endpoints.auth.register, payload);

      if (res.data.success) {
        showToast("Registrasi berhasil!", "success");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      let errorMsg = "Registrasi gagal. Coba lagi.";
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
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleChange,
    handleSubmit,
  };
}
