import { useState, useEffect } from "react";

export function useEditPromo(selectedPromo, onSuccess, showToast) {
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

  useEffect(() => {
    if (selectedPromo) {
      setFormData({
        nama: selectedPromo.nama || "",
        jenisPromo: selectedPromo.jenisPromo || "",
        kategoriProduk: selectedPromo.kategoriProduk || "",
        produk: selectedPromo.produk || "",
        tanggalMulai: selectedPromo.tanggalMulai || "",
        tanggalSelesai: selectedPromo.tanggalSelesai || "",
        minimalTransaksi: selectedPromo.minimalTransaksi || "",
        kodePromo: selectedPromo.kodePromo || "",
        deskripsi: selectedPromo.deskripsi || "",
        diskon: selectedPromo.diskon || "",
        status: selectedPromo.status || "Aktif",
      });
    }
  }, [selectedPromo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditPromo = async (e) => {
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
      
      const updatedDocs = docs.map((doc) => {
        if (doc.id.toString() === selectedPromo.id.toString()) {
          return {
            ...doc,
            ...formData
          };
        }
        return doc;
      });

      localStorage.setItem("mische_promos", JSON.stringify(updatedDocs));
      
      showToast("Promo ini berhasil diperbarui!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Gagal memperbarui data.");
      showToast("Gagal memperbarui promo.", "error");
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
    submitEditPromo,
  };
}
