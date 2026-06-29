import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveUser } from "@/core/utils/authStorage";

// Aturan keamanan gembok: minimal 8 huruf, dan wajib mencampur huruf besar dan kecil
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * AHLI PEMBUAT KUNCI GEMBOK (useUbahPasswordAdmin)
 * Ibarat tukang kunci teliti yang memeriksa calon anak kunci baru. Tukang kunci ini memastikan 
 * kuncinya cukup panjang, kuat (campuran huruf besar & kecil), dan memastikan kunci cadangan 
 * (konfirmasi) bentuknya 100% sama dengan kunci utama, sebelum mengantarkannya ke kantor pusat.
 */
export function useUbahPasswordAdmin(formData, onSuccess) {
  // 1. KOTAK ISIAN KATA SANDI DI ATAS KERTAS
  const [passwordData, setPasswordData] = useState({
    password: "", // Anak kunci baru
    confirmPassword: "", // Kunci cadangan (konfirmasi)
  });
  
  // Saklar pembuka tirai penutup huruf (simbol mata) agar tulisan bintang (******) bisa diintip
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  
  // Papan catatan jika ada kesalahan (misal: kunci terlalu pendek)
  const [errorMessage, setErrorMessage] = useState("");

  // Fungsi saat admin sedang mencatat/mengetik kunci baru
  const handleChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk membuang seluruh kertas isian dan membersihkan meja (reset)
  const reset = () => {
    setPasswordData({ password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage("");
  };

  // 2. PEMERIKSAAN KEKUATAN KUNCI SEBELUM DIKIRIM KE PUSAT
  const handleSave = async () => {
    setErrorMessage(""); // Bersihkan papan catatan kesalahan

    // Syarat 1: Kertas tidak boleh dibiarkan kosong
    if (!passwordData.password) {
      setErrorMessage("Password baru tidak boleh kosong!");
      return;
    }
    // Syarat 2: Kunci harus kuat (minimal 8 karakter, mencakup huruf besar & kecil)
    if (!PASSWORD_REGEX.test(passwordData.password)) {
      setErrorMessage(
        "Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!"
      );
      return;
    }
    // Syarat 3: Kunci cadangan (konfirmasi) harus persis sama dengan kunci baru
    if (passwordData.password !== passwordData.confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      // Mengirimkan data profil lama bersama kunci rahasia baru ke kantor pusat
      const payload = { ...formData, password: passwordData.password };
      const res = await axiosClient.put(endpoints.admin.profile, payload);

      // Jika kantor pusat menyetujui kuncinya, simpan dan bersihkan meja
      if (res.data.success) {
        reset();
        saveUser(res.data.data); // Simpan catatan terbarui ke dalam laci meja
        onSuccess && onSuccess(res.data.data);
      }
    } catch (error) {
      // Jika kantor pusat menolak, catat alasan penolakannya
      let errorMsg = "Gagal mengubah password.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    }
  };

  // Serahkan seluruh pena dan kertas kunci ini ke jendela pop-up
  return {
    passwordData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errorMessage,
    handleChange,
    handleSave,
    reset,
  };
}
