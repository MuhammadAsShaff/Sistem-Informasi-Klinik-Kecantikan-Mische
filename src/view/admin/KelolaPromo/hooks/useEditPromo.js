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
    idKategori: "",
    idProduk: ""
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
        idKategori: selectedPromo.idKategori || "ALL",
        idProduk: selectedPromo.idProduk || "ALL"
      });
    }
  }, [selectedPromo]);

const convertToJPEG = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(newFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.9);
      };
      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const convertedFile = await convertToJPEG(file);
        setFormData((prev) => ({ ...prev, [name]: convertedFile }));
      }
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

    const isKategoriSelected = formData.idKategori && formData.idKategori !== "ALL";
    const isProdukSelected = formData.idProduk && formData.idProduk !== "ALL";

    if (isKategoriSelected && isProdukSelected) {
      setError("Tidak bisa memilih Kategori dan Produk secara bersamaan. Pilih salah satu, atau kosongkan keduanya.");
      return;
    }

    if (formData.jenisPromo === "Gratis Produk" && !isProdukSelected) {
      setError("Untuk promo Gratis Produk, Anda wajib memilih produk bonus secara spesifik (tidak boleh 'Semua Produk' atau kosong).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();

      let finalDiskon = formData.diskon;
      if (formData.jenisPromo === "Gratis Produk") {
        finalDiskon = 0;
      } else if (!finalDiskon) {
        finalDiskon = 0;
      }

      Object.keys(formData).forEach(key => {
        if (key === 'diskon') {
           payload.append('diskon', finalDiskon);
           return;
        }

        if (key === 'idKategori' || key === 'idProduk') {
           if (!formData[key] || formData[key] === 'ALL') {
             payload.append(key, ""); // Kirim string kosong agar laravel mengubahnya jadi null
           } else {
             payload.append(key, formData[key]);
           }
           return;
        }

        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
           payload.append(key, formData[key]);
        }
      });
      // Pastikan status adalah integer
      payload.set('status', formData.status ? 1 : 0);
      payload.append('_method', 'PUT'); // untuk laravel multipart form data update

      const idPromo = selectedPromo.idPromo || selectedPromo.id;
      const res = await axiosClient.post(`${endpoints.admin.promo}/${idPromo}`, payload);
      
      if (res.data?.success) {
        showToast("Berhasil memperbarui promo", "success");
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
