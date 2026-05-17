import { useState, useEffect, useRef } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

/**
 * Hook untuk memperbarui kegiatan (UPDATE).
 * Fetch detail kegiatan berdasarkan `id` saat modal dibuka.
 *
 * @param {string|number|null} id       - ID kegiatan yang diedit
 * @param {boolean}            isOpen   - Status modal (trigger fetch)
 * @param {Function}           onSuccess - Callback setelah berhasil update
 */
export function useEditKegiatan(id, isOpen, onSuccess) {
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    deskripsi: "",
    tanggalKegiatan: "",
    foto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFileError, setHasFileError] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch detail kegiatan saat modal dibuka dan ada ID
  useEffect(() => {
    if (isOpen && id) {
      fetchDetail();
    }
  }, [isOpen, id]);

  const fetchDetail = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.kegiatan);
      if (res.data.success) {
        const item = res.data.data.find((k) => k.idKegiatan === id || k.id === id);
        if (item) {
          setFormData({
            namaKegiatan: item.namaKegiatan || "",
            deskripsi: item.deskripsi || "",
            tanggalKegiatan: item.tanggalKegiatan ? item.tanggalKegiatan.substring(0, 10) : "",
            foto: null,
          });
          setPreviewImage(
            item.foto ? `http://127.0.0.1:8000/storage/${item.foto}` : null
          );
        }
      }
    } catch (error) {
      console.error("Gagal mengambil detail kegiatan:", error);
    }
  };

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
      payload.append("_method", "PUT");
      payload.append("namaKegiatan", formData.namaKegiatan);
      payload.append("deskripsi", formData.deskripsi);
      payload.append("tanggalKegiatan", formData.tanggalKegiatan);
      if (formData.foto) payload.append("foto", formData.foto);

      const res = await axiosClient.post(`${endpoints.admin.kegiatan}/${id}`, payload);
      if (res.data.success) {
        if (fileInputRef.current) fileInputRef.current.value = "";
        onSuccess && onSuccess();
      }
    } catch (error) {
      let msg = "Gagal memperbarui kegiatan.";
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
