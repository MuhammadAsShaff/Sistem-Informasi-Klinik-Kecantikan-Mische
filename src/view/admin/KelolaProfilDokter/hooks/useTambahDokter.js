import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { convertToJPEG } from "@/utils/imageConverter";

/**
 * ASISTEN JURU TULIS PENDAFTARAN DOKTER BARU (useTambahDokter)
 * Ibarat asisten pendaftaran yang berdiri di meja penerimaan dokter baru. Asisten ini menyodorkan 
 * formulir kosong untuk mencatat nama, email, penjelasan keahlian, dan pasfoto dokter. 
 * Asisten ini juga pintar mencetak foto ke standar JPEG sebelum menyerahkan mapnya ke pihak rumah sakit.
 */
export function useTambahDokter(onSuccess, showToast) {
  // 1. KERTAS FORMULIR ISIAN PENDAFTARAN DOKTER BARU
  const [formData, setFormData] = useState({
    name: "", // Nama lengkap dokter baru
    email: "", // Alamat email dokter
    description: "", // Penjelasan singkat keahlian
    image: "", // Tampilan intip foto di layar
    status: "Tersedia", // Status awal
  });
  
  // Catatan teguran jika ada kotak yang lupa diisi
  const [error, setError] = useState("");
  // Tanda bahwa kurir sedang berangkat membawa map pendaftaran ke pusat
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi saat admin sedang mencatat tulisan di formulir
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi cerdas saat admin melampirkan pasfoto dokter
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Meminta tukang cetak foto mengubah formatnya ke JPEG standar
      const convertedFile = await convertToJPEG(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Pasang pajangannya di meja
          imageFile: convertedFile, // Berkas asli yang siap dikirim
        }));
      };
      reader.readAsDataURL(convertedFile);
    }
  };

  // Fungsi untuk membersihkan meja dan menyingkirkan kertas yang kotor (reset)
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      description: "",
      image: "",
      imageFile: null,
      status: "Tersedia",
    });
    setError("");
  };

  // 2. PROSES PENGIRIMAN MAP PENDAFTARAN KE RUMAH SAKIT PUSAT
  const submitTambahDokter = async (e) => {
    if (e) e.preventDefault();
    
    // Syarat mutlak: Nama, email, dan deskripsi tidak boleh dibiarkan kosong
    if (!formData.name || !formData.email || !formData.description) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Membungkus seluruh isian ke dalam map pendaftaran (FormData)
      const data = new FormData();
      data.append('nama', formData.name);
      data.append('email', formData.email);
      data.append('deskripsi', formData.description);
      
      // Jika ada pasfoto, sertakan di dalam map
      if (formData.imageFile) {
        data.append('foto', formData.imageFile);
      }

      // Kurir membawa map pendaftaran ke manajemen dokter di server
      const res = await axiosClient.post(endpoints.admin.doctors, data);
      
      // Jika manajemen menerima pendaftarannya, umumkan lewat TOA dan bersihkan meja
      if (res.data?.success) {
        showToast("Berhasil menambahkan profil dokter", "success");
        resetForm();
        if (onSuccess) onSuccess(); // Suruh asisten menyegarkan buku daftar
      }
    } catch (err) {
      console.error(err);
      // Jika ditolak (misal: email sudah dipakai dokter lain), bacakan surat penolakannya
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Gagal menyimpan data.");
      }
      showToast("Gagal menambahkan profil dokter.", "error");
    } finally {
      setIsSubmitting(false); // Kurir telah kembali ke posnya
    }
  };

  // Serahkan seluruh berkas dan fungsi pendaftaran ini ke meja pop-up
  return {
    formData,
    setFormData,
    error,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    submitTambahDokter,
    resetForm,
  };
}
