import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints, STORAGE_BASE_URL } from "@/core/api/endpoints";
import { convertToJPEG } from "@/utils/imageConverter";

export function useEditDokter(selectedDokter, onSuccess, showToast) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    image: "",
    status: "Tersedia",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDokter) {
      const fullImageUrl = selectedDokter.foto && !selectedDokter.foto.startsWith('http') 
        ? `${STORAGE_BASE_URL}${selectedDokter.foto}`
        : (selectedDokter.foto || "");

      setFormData({
        name: selectedDokter.nama ? selectedDokter.nama.replace("Dr. ", "") : "",
        email: selectedDokter.email || "",
        description: selectedDokter.deskripsi || "",
        image: fullImageUrl,
        status: selectedDokter.status || "Tersedia",
      });
    }
  }, [selectedDokter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const convertedFile = await convertToJPEG(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
          imageFile: convertedFile,
        }));
      };
      reader.readAsDataURL(convertedFile);
    }
  };

  const submitEditDokter = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append('nama', formData.name.startsWith("Dr. ") ? formData.name : `Dr. ${formData.name.toUpperCase()}`);
      data.append('email', formData.email);
      data.append('deskripsi', formData.description);
      
      if (formData.imageFile) {
        data.append('foto', formData.imageFile);
      }
      
      // Method spoofing for Laravel PUT request with multipart/form-data
      data.append('_method', 'PUT');

      const docId = selectedDokter.idDokter || selectedDokter.id;

      await axiosClient.post(`${endpoints.admin.doctors}/${docId}`, data);
      
      showToast("Berhasil memperbarui profil dokter!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Gagal memperbarui data.");
      }
      showToast("Gagal memperbarui profil dokter.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    submitEditDokter,
  };
}
