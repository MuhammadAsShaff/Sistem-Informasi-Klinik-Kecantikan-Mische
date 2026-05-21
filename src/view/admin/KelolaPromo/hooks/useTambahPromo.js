import { useState } from "react";

export function useTambahPromo(onSuccess, showToast) {
  const [formData, setFormData] = useState({
    nama: "",
    jenisPromo: "",
    kategoriProduk: "",
    produk: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    minimalTransaksi: "",
    kodePromo: "",
    deskripsi: "",
    diskon: "",
    status: "Aktif",
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

  const resetForm = () => {
    setFormData({
      nama: "",
      jenisPromo: "",
      kategoriProduk: "",
      produk: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      minimalTransaksi: "",
      kodePromo: "",
      deskripsi: "",
      diskon: "",
      status: "Aktif",
    });
    setError("");
  };

  const submitTambahPromo = async (e) => {
    if (e) e.preventDefault();
    if (!formData.nama || !formData.jenisPromo || !formData.kodePromo || !formData.tanggalMulai || !formData.tanggalSelesai) {
      setError("Nama, Jenis, Kode, dan Tanggal wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const stored = localStorage.getItem("mische_promos");
      let docs = [];
      try {
        docs = stored ? JSON.parse(stored) : [];
      } catch (parseErr) {
        docs = [];
      }
      
      const newPromo = {
        id: docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1,
        ...formData
      };

      const updatedDocs = [...docs, newPromo];
      localStorage.setItem("mische_promos", JSON.stringify(updatedDocs));
      
      showToast("Promo ini berhasil ditambahkan!", "success");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Gagal menyimpan data.");
      showToast("Gagal menambahkan promo.", "error");
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
    submitTambahPromo,
    resetForm,
  };
}
