import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

// Lembar formulir putih bersih tanpa ada coretan apa pun
const INITIAL_FORM = {
  nama: "",
  email: "",
  password: "",
  jenisKelamin: "",
  alamat: "",
  role: "",
  tanggalLahir: "",
  nomorWa: "",
  provinceId: "",
  cityId: "",
  kecamatan: "",
  kodePos: "",
  detailAlamat: "",
};

/**
 * =========================================================================
 * ASISTEN KURIR PENDAFTARAN ANGGOTA BARU (useTambahUser)
 * =========================================================================
 * Ibarat asisten kurir cepat yang bersiap di samping meja pendaftaran anggota baru.
 * Begitu pimpinan selesai mengisi formulir biodata dan alamat, kurir ini mengemas berkasnya,
 * menolak keras jika ada huruf di kotak telepon, lalu mengayuh sepeda kencang menuju loket pusat (POST).
 */
export function useTambahUser(onSuccess, showToast) {
  // Laci kertas formulir isian pendaftaran anggota baru
  const [formData, setFormData] = useState(INITIAL_FORM);
  // Saklar senter untuk mengintip kata sandi yang diketik
  const [showPassword, setShowPassword] = useState(false);

  /**
   * PENCATAT SETIAP CORETAN PENA (handleChange)
   * Setiap kali admin mengetik, asisten mencatatnya. Khusus kotak nomor WA, asisten memangkas semua huruf/simbol.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nomor WA wajib bersih dari huruf (hanya angka tulen)
    if (name === "nomorWa") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * TUGAS PENGIRIMAN BERKAS PENDAFTARAN (handleSubmit)
   * Kurir mengantarkan bungkusan formulir ke loket pendaftaran pusat (POST).
   */
  const handleSubmit = async () => {
    try {
      await axiosClient.post(endpoints.admin.users, formData);
      showToast("Berhasil menambahkan user", "success");
      setFormData(INITIAL_FORM); // Ambil lembar putih baru setelah berhasil pendaftaran
      onSuccess(); // Tutup meja pendaftaran dan segarkan papan daftar
    } catch (error) {
      console.error("Gagal menambah user:", error);
      let errorMessage = "Gagal menambahkan user. Silakan coba lagi.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error"); // Umumkan di mikrofon jika kandas
    }
  };

  // Kurir menyerahkan sepeda dan laci isian kepada meja pendaftaran (useModalTambahUser)
  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
