import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveUser } from "@/core/utils/authStorage";

/**
 * JURU TULIS FORMULIR EDIT BIODATA ADMIN (useUpdateProfilAdmin)
 * Ibarat juru tulis cekatan yang berjaga di meja pengubahan KTP/Biodata admin.
 * Saat admin duduk, juru tulis ini langsung menyodorkan kertas isian yang sudah ditulisi 
 * data lama (nama, email, tanggal lahir, nomor WA). Juru tulis ini juga pintar: jika admin 
 * memasukkan foto profil baru, dia langsung mencetaknya ke format foto standar (JPEG).
 */
export function useUpdateProfilAdmin(user, showToast, onUpdated) {
  // 1. KOTAK-KOTAK ISIAN DI ATAS KERTAS FORMULIR BIODATA
  const [formData, setFormData] = useState({
    nama: "", // Nama lengkap
    email: "", // Alamat surel / email
    tanggalLahir: "", // Tanggal lahir
    jenisKelamin: "", // Jenis kelamin (Laki-laki / Perempuan)
    nomorWa: "", // Nomor Whatsapp
    alamat: "", // Alamat domisili
  });

  // 2. MENGISI FORMULIR DENGAN DATA LAMA AGAR ADMIN TIDAK MENGETIK DARI AWAL
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

  // 3. FUNGSI CERDAS SAAT ADMIN MENGETIK ATAU MEMILIH FOTO BARU
  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    
    // Jika admin memilih berkas foto baru
    if (type === "file") {
      const file = files[0];
      if (file) {
        // Memanggil tukang cetak foto untuk mengubah ukurannya menjadi JPEG standar
        const { convertToJPEG } = await import("@/utils/imageConverter");
        const convertedFile = await convertToJPEG(file);
        setFormData((prev) => ({ ...prev, [name]: convertedFile }));
      }
    } else if (name === "nomorWa") {
      // Jika mengisi nomor Whatsapp, bersihkan tulisan dari huruf dan tinggalkan angkanya saja
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      // Mengetik isian biasa (nama, email, alamat)
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 4. MENGIRIM FORMULIR BIODATA KE KANTOR PUSAT
  const handleSimpan = async () => {
    try {
      // Membungkus seluruh isian dan lampiran foto ke dalam map tebal (FormData)
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && key !== "password") {
          // Jika foto profilnya masih pakai foto lama (berupa alamat link web), tidak usah dikirim lagi.
          // Hanya kirimkan jika ada file foto baru.
          if (key === "fotoProfil" && typeof formData[key] === "string") {
            return;
          }
          payload.append(key, formData[key]);
          if (key === "fotoProfil") {
            payload.append("foto_profil", formData[key]);
            payload.append("foto", formData[key]); // Menjaga kecocokan dengan laci penyimpanan server
          }
        }
      });
      
      // Memberi stempel pembaruan data (PUT)
      payload.append("_method", "PUT");

      // Kurir mengantarkan map ke kantor pusat
      const res = await axiosClient.post(endpoints.admin.profile, payload);

      // Jika kantor pusat memberi cap "Berhasil Diperbarui", umumkan lewat TOA dan salin ke laci meja
      if (res.data.success) {
        const updatedUser = res.data.data;
        showToast("Profil berhasil diperbarui!", "success");
        saveUser(updatedUser); // Simpan salinannya ke laci meja (authStorage)
        onUpdated && onUpdated(updatedUser); // Segarkan foto di pojok atas layar
      }
    } catch (error) {
      // Jika ditolak (misal: email sudah terpakai orang lain), bacakan alasan penolakannya
      let errorMsg = "Gagal memperbarui profil.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg, "error");
    }
  };

  // Serahkan seluruh fungsi pena, kertas, dan tombol simpan ke tampilan formulir
  return {
    formData,
    handleChange,
    handleSimpan,
  };
}
