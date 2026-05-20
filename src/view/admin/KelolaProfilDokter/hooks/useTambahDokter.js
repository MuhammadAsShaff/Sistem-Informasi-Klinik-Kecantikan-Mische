import { useState } from "react";

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
          image: reader.result, // Mengubah image menjadi base64 string agar bisa disimpan di localStorage
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
    try {
      const stored = localStorage.getItem("mische_doctors");
      let docs = [];
      try {
        docs = stored ? JSON.parse(stored) : [];
      } catch (parseErr) {
        docs = [];
      }
      
      const newDoc = {
        id: docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1,
        name: formData.name.startsWith("Dr. ") ? formData.name : `Dr. ${formData.name.toUpperCase()}`,
        email: formData.email,
        description: formData.description,
        image: formData.image || "https://via.placeholder.com/150",
        status: formData.status || "Tersedia",
        experience: "Dokter dengan pengalaman di klinik Mische",
      };

      const updatedDocs = [...docs, newDoc];
      localStorage.setItem("mische_doctors", JSON.stringify(updatedDocs));
      
      showToast("Berhasil menambahkan profil dokter baru!", "success");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Gagal menyimpan data.");
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
