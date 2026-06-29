import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveUser } from "@/core/utils/authStorage";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * =========================================================================
 * MANDOR KEAMANAN KUNCI BRANKAS (useUbahPasswordCustomer)
 * =========================================================================
 * Ibarat perwira keamanan brankas yang memastikan kunci baru memenuhi standar
 * kokoh (minimal 8 karakter, ada huruf besar dan kecil) serta memeriksa
 * kesesuaian kunci cadangan sebelum menyimpannya ke dalam brankas.
 *
 * @param {Object}   formData  - Data profil saat ini (dikirim bersama payload)
 * @param {Function} onSuccess - Callback dengan data user terbaru setelah berhasil
 */
export function useUbahPasswordCustomer(formData, onSuccess) {
  const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setPasswordData({ password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage("");
  };

  const handleSave = async () => {
    setErrorMessage("");

    if (!passwordData.password) {
      setErrorMessage("Password baru tidak boleh kosong!");
      return;
    }
    if (!PASSWORD_REGEX.test(passwordData.password)) {
      setErrorMessage("Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!");
      return;
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      const payload = { ...formData, password: passwordData.password };
      const res = await axiosClient.put(endpoints.customer.profile, payload);
      if (res.data.success) {
        saveUser(res.data.data); // simpan & dispatch event reaktivitas otomatis
        reset();
        onSuccess && onSuccess(res.data.data);
      }
    } catch (error) {
      let errorMsg = "Gagal mengubah password.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    }
  };

  return {
    passwordData,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    errorMessage,
    handleChange,
    handleSave,
    reset,
  };
}
