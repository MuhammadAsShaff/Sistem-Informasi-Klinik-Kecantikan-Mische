import { useState, useRef } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

const INITIAL_FORM = { namaKegiatan: "", deskripsi: "", tanggalKegiatan: "", foto: null };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

/**
 * Hook untuk menambah kegiatan baru (CREATE).
 *
 * @param {Function} onSuccess - Callback setelah berhasil tambah
 */
export function useTambahKegiatan(onSuccess) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFileError, setHasFileError] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Format file tidak didukung! Gunakan: jpeg, png, atau jpg.");
      setHasFileError(true);
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Maksimal ukuran gambar adalah 2MB.");
      setHasFileError(true);
      e.target.value = "";
      return;
    }
    setErrorMessage("");
    setHasFileError(false);
    setFormData((prev) => ({ ...prev, foto: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!formData.namaKegiatan || !formData.deskripsi || !formData.tanggalKegiatan) {
      setErrorMessage("Harap isi nama kegiatan, deskripsi, dan tanggal kegiatan!");
      return;
    }
    try {
      setIsLoading(true);
      const payload = new FormData();
      payload.append("namaKegiatan", formData.namaKegiatan);
      payload.append("deskripsi", formData.deskripsi);
      payload.append("tanggalKegiatan", formData.tanggalKegiatan);
      if (formData.foto) payload.append("foto", formData.foto);

      const res = await axiosClient.post(endpoints.admin.kegiatan, payload);
      if (res.data.success) {
        setFormData(INITIAL_FORM);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onSuccess && onSuccess();
      }
    } catch (error) {
      let msg = "Gagal menambahkan kegiatan.";
      if (error.response?.data?.errors) msg = Object.values(error.response.data.errors)[0][0];
      else if (error.response?.data?.message) msg = error.response.data.message;
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
