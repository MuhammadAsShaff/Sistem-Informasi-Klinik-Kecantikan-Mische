import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useEditPromo(selectedPromo, onSuccess, showToast) {
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
    idKategori: 1,
    idProduk: 1
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPromo) {
      setFormData({
        namaPromo: selectedPromo.namaPromo || selectedPromo.nama || "",
        jenisPromo: selectedPromo.jenisPromo || "",
        tanggalMulai: selectedPromo.tanggalMulai ? selectedPromo.tanggalMulai.split(' ')[0] : "",
        tanggalSelesai: selectedPromo.tanggalSelesai ? selectedPromo.tanggalSelesai.split(' ')[0] : "",
        minimalTransaksi: selectedPromo.minimalTransaksi || "",
        kode: selectedPromo.kode || selectedPromo.kodePromo || "",
        deskripsi: selectedPromo.deskripsi || "",
        diskon: selectedPromo.diskon || "",
        status: selectedPromo.status !== undefined ? selectedPromo.status : true,
        gambar: null,
        idKategori: selectedPromo.idKategori || 1,
        idProduk: selectedPromo.idProduk || 1
      });
    }
  }, [selectedPromo]);

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

  const submitEditPromo = async (e) => {
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
      // Pastikan status adalah integer
      payload.set('status', formData.status ? 1 : 0);
      payload.append('_method', 'PUT'); // untuk laravel multipart form data update

      const idPromo = selectedPromo.idPromo || selectedPromo.id;
      const res = await axiosClient.post(`${endpoints.admin.promo}/${idPromo}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data?.success) {
        showToast("Promo ini berhasil diperbarui!", "success");
        if (onSuccess) onSuccess();
      } else {
        showToast("Gagal memperbarui promo.", "error");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal memperbarui data.";
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
    submitEditPromo,
  };
}
