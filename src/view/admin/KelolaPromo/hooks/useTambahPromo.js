import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useTambahPromo(onSuccess, showToast) {
  const [formData, setFormData] = useState({
    namaPromo: "",
    jenisPromo: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    minimalTransaksi: "",
    kode: "",
    deskripsi: "",
    diskon: "",
    status: true,
    gambar: null,
    // Add dummy values to bypass backend requirement if missing
    idKategori: 1, 
    idProduk: 1
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "status" ? value === "true" || value === true : value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      namaPromo: "",
      jenisPromo: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      minimalTransaksi: "",
      kode: "",
      deskripsi: "",
      diskon: "",
      status: true,
      gambar: null,
      idKategori: 1,
      idProduk: 1
    });
    setError("");
  };

  const submitTambahPromo = async (e) => {
    if (e) e.preventDefault();
    if (!formData.namaPromo || !formData.jenisPromo || !formData.kode || !formData.tanggalMulai || !formData.tanggalSelesai) {
      setError("Nama, Jenis, Kode, dan Tanggal wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
           payload.append(key, formData[key]);
        }
      });
      // Pastikan status adalah integer atau boolean string (1/0)
      payload.set('status', formData.status ? 1 : 0);

      const res = await axiosClient.post(endpoints.admin.promo, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data?.success) {
        showToast(res.data.message || "Promo ini berhasil ditambahkan!", "success");
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        showToast("Gagal menambahkan promo.", "error");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal menyimpan data.";
      const errorDetails = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : "";
      setError(errorDetails ? `${errMsg} (${errorDetails})` : errMsg);
      showToast(errorDetails ? `${errMsg} (${errorDetails})` : errMsg, "error");
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
