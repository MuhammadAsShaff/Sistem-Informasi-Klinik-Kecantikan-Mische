import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * ASISTEN JURU TULIS PERUBAHAN BIODATA USER (useEditUser)
 * =========================================================================
 * Ibarat asisten juru tulis terlatih yang bertugas mengurus perubahan biodata anggota klinik.
 * Ketika pimpinan mengubah nama, kata sandi, atau alamat, asisten ini mengemas tulisan tersebut 
 * dengan cermat, memangkas huruf dari kotak telepon (hanya boleh angka!), lalu berlari 
 * mengantarkannya ke loket pusat.
 */
export function useEditUser(userData, onSuccess, showToast) {
  // Laci kertas formulir isian biodata anggota
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "", // Kosong berarti gembok kata sandi lama tidak diutak-atik
    jenisKelamin: "",
    alamat: "",
    role: "",
    tanggalLahir: "",
    nomorWa: "",
    alamat_lengkap: [],
  });
  // Saklar senter untuk mengintip kata sandi yang diketik
  const [showPassword, setShowPassword] = useState(false);

  /**
   * EFEK SAMPING: MENYALIN DATA LAMA KETIKA TOMBOL EDIT DITEKAN
   * Begitu pimpinan menaruh berkas anggota di atas meja (userData), asisten langsung menyalin biodatanya.
   */
  useEffect(() => {
    if (userData) {
      setFormData({
        nama: userData.nama || "",
        email: userData.email || "",
        password: "", // Kosongkan agar kata sandi lama tetap utuh jika tidak diganti
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

  /**
   * PENCATAT SETIAP CORETAN PENA (handleChange)
   * Setiap kali admin mengetik, asisten mencatatnya. Khusus untuk nomor WA, asisten menolak keras huruf/simbol.
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
   * TUGAS PENGUTUSAN JURU TULIS (handleSubmit)
   * Asisten memastikan ada berkas yang dipegang, lalu berlari mengantarkannya ke loket pusat (PUT).
   */
  const handleSubmit = async () => {
    if (!userData) return;
    try {
      const idUser = userData.idUser || userData.id;
      await axiosClient.put(`${endpoints.admin.users}/${idUser}`, formData);
      showToast("Berhasil memperbarui user", "success");
      onSuccess(); // Tutup meja kerja dan segarkan papan daftar
    } catch (error) {
      console.error("Gagal memperbarui user:", error);
      let errorMessage = "Gagal memperbarui data user.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error"); // Umumkan di mikrofon jika kandas
    }
  };

  // Asisten menyerahkan formulir dan saklar senter kepada meja perbaikan (ModalPerbaruiUser)
  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
