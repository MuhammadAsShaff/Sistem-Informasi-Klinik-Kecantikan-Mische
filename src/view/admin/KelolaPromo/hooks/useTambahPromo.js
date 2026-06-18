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
    // Kosongkan secara default agar promo bersifat global
    idKategori: "", 
    idProduk: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      idKategori: "",
      idProduk: ""
    });
    setError("");
  };

  const submitTambahPromo = async (e) => {
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
      // Pastikan status adalah integer atau boolean string (1/0)
      payload.set('status', formData.status ? 1 : 0);

      const res = await axiosClient.post(endpoints.admin.promo, payload);
      
      if (res.data?.success) {
        showToast("Berhasil menambahkan promo", "success");
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        showToast("Gagal menambahkan promo.", "error");
      }
    } catch (err) {
      console.error("Error submit promo:", err.response || err);
      
      let finalMessage = "Gagal menyimpan data.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          finalMessage = err.response.data; // e.g. HTML error
        } else {
          const errMsg = err.response.data.message || err.response.data.error || finalMessage;
          const errors = err.response.data.errors;
          
          if (errors && typeof errors === 'object') {
            const errorDetails = Object.values(errors).flat().join(", ");
            finalMessage = errorDetails ? `${errMsg}\nDetail: ${errorDetails}` : errMsg;
          } else {
            finalMessage = errMsg;
          }
        }
      } else if (err.message) {
        finalMessage = err.message;
      }
      
      setError(finalMessage);
      showToast(finalMessage, "error");
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
