import { useState, useRef } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

const INITIAL_FORM = { namaKegiatan: "", deskripsi: "", tanggalKegiatan: "", foto: null };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

/**
 * ASISTEN JURU TULIS PENDAFTARAN KEGIATAN BARU (useTambahKegiatan)
 * Ibarat asisten pendaftaran yang berdiri di meja pengumuman mading baru. Asisten ini menyodorkan 
 * formulir kosong untuk menuliskan nama acara, cerita kegiatan, tanggal pelaksanaan, dan melampirkan foto.
 * Asisten ini juga cerdas menimbang berat foto (maksimal 2MB) dan mencetaknya ke standar JPEG sebelum ditempel.
 */
export function useTambahKegiatan(onSuccess) {
  // 1. KERTAS FORMULIR ISIAN KEGIATAN BARU
  const [formData, setFormData] = useState(INITIAL_FORM);
  // Lukisan intip foto kegiatan di layar
  const [previewImage, setPreviewImage] = useState(null);
  // Tanda bahwa kurir sedang membawa kertas pendaftaran ke server
  const [isLoading, setIsLoading] = useState(false);
  // Papan teguran jika ada kotak isian yang tertinggal
  const [errorMessage, setErrorMessage] = useState("");
  // Stempel tanda jika foto melanggar batas berat
  const [hasFileError, setHasFileError] = useState(false);
  // Kotak laci tempat menaruh berkas foto
  const fileInputRef = useRef(null);

  // Fungsi saat admin sedang mencatat tulisan di formulir
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Fungsi pintar saat admin melampirkan foto kegiatan baru
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Timbangan otomatis: Jika melebihi 2MB, tolak dan pasang papan teguran
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Maksimal ukuran gambar adalah 2MB.");
      setHasFileError(true);
      e.target.value = "";
      return;
    }
    
    // Meminta tukang cetak menyamakan standar warna dan format ke JPEG
    const { convertToJPEG } = await import("@/utils/imageConverter");
    const convertedFile = await convertToJPEG(file);
    
    setErrorMessage("");
    setHasFileError(false);
    setFormData((prev) => ({ ...prev, foto: convertedFile }));
    setPreviewImage(URL.createObjectURL(convertedFile)); // Pajang di meja intip
  };

  // 2. PROSES PENGIRIMAN MAP PENDAFTARAN KE KANTOR PUSAT
  const handleSubmit = async () => {
    setErrorMessage("");
    
    // Syarat ketat: Judul, cerita, dan tanggal pelaksanaan tidak boleh dibiarkan kosong
    if (!formData.namaKegiatan || !formData.deskripsi || !formData.tanggalKegiatan) {
      setErrorMessage("Harap isi nama kegiatan, deskripsi, dan tanggal kegiatan!");
      return;
    }
    try {
      setIsLoading(true);
      // Membungkus seluruh isian ke dalam map besar (FormData)
      const payload = new FormData();
      payload.append("namaKegiatan", formData.namaKegiatan);
      payload.append("deskripsi", formData.deskripsi);
      payload.append("tanggalKegiatan", formData.tanggalKegiatan);
      if (formData.foto) payload.append("foto", formData.foto);

      // Kurir mengantarkan map ke bagian mading di server
      const res = await axiosClient.post(endpoints.admin.kegiatan, payload);
      if (res.data.success) {
        // Bersihkan meja formulir dan laci foto dari kertas bekas
        setFormData(INITIAL_FORM);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onSuccess && onSuccess(); // Beri tahu mandor untuk menyegarkan mading
      }
    } catch (error) {
      let msg = "Gagal menambahkan kegiatan.";
      if (error.response?.data?.errors) msg = Object.values(error.response.data.errors)[0][0];
      else if (error.response?.data?.message) msg = error.response.data.message;
      setErrorMessage(msg);
    } finally {
      setIsLoading(false); // Kurir telah kembali ke posnya
    }
  };

  // Asisten menyerahkan berkas dan penanya ke jendela pop-up
  return {
    formData,
    previewImage,
    isLoading,
    errorMessage,
    hasFileError,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}
