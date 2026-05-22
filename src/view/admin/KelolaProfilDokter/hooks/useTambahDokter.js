import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useTambahDokter(onSuccess, showToast) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    image: "",
    status: "Tersedia",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, 
          imageFile: file, // Simpan file aslinya
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const submitTambahDokter = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append('nama', formData.name);
      data.append('email', formData.email);
      data.append('deskripsi', formData.description);
      
      if (formData.imageFile) {
        data.append('foto', formData.imageFile);
      } else {
        // Jika tidak ada file (mungkin backend perlu format tertentu atau ini akan kena validasi require gambar)
        // Tergantung validasi di backend, tapi jika required, backend akan melempar pesan error.
      }

      await axiosClient.post(endpoints.admin.doctors, data);
      
      showToast("Berhasil menambahkan profil dokter baru!", "success");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Gabungkan semua pesan error validasi
        const messages = Object.values(err.response.data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Gagal menyimpan data.");
      }
      showToast("Gagal menambahkan profil dokter.", "error");
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
    submitTambahDokter,
    resetForm,
  };
}
