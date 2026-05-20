import { useState, useEffect } from "react";

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
      setFormData({
        name: selectedDokter.name.replace("Dr. ", ""),
        email: selectedDokter.email || `${selectedDokter.name.toLowerCase().replace("dr. ", "").replace(/ /g, "")}@gmail.com`,
        description: selectedDokter.description || "",
        image: selectedDokter.image || "",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitEditDokter = async (e) => {
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
      
      const updatedDocs = docs.map((doc) => {
        if (doc.id.toString() === selectedDokter.id.toString()) {
          return {
            ...doc,
            name: formData.name.startsWith("Dr. ") ? formData.name : `Dr. ${formData.name.toUpperCase()}`,
            email: formData.email,
            description: formData.description,
            image: formData.image || doc.image,
            status: formData.status || "Tersedia",
          };
        }
        return doc;
      });

      localStorage.setItem("mische_doctors", JSON.stringify(updatedDocs));
      
      showToast("Berhasil memperbarui profil dokter!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Gagal memperbarui data.");
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
