import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * ASISTEN JURU TULIS KOREKSI LEMBAR PROMO (useEditPromo)
 * =========================================================================
 * Ibarat asisten juru tulis yang memegang penghapus dan pena baru untuk memperbaiki syarat promo lama.
 * Tugas asisten ini meliputi:
 * 1. Mengisi meja kerja dengan riwayat promo lama yang mau dikoreksi.
 * 2. Menimbang dan mencuci foto baru (jika ada) menjadi format JPEG yang rapi.
 * 3. Memastikan aturan ketat: tidak boleh memilih Kategori dan Produk sekaligus, 
 *    dan jika promonya "Gratis Produk", produk bonusnya wajib dipilih jelas.
 * 4. Mengemas seluruh berkas ke dalam koper (FormData) dan mengirimkannya ke kantor pusat.
 */
export function useEditPromo(selectedPromo, onSuccess, showToast) {
  // Formulir catatan tempat asisten menulis seluruh syarat promo
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
  // Papan teguran jika ada isian yang melanggar aturan
  const [error, setError] = useState("");
  // Rambu penanda kurir sedang mengayuh sepeda menuju kantor pusat
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * EFEK SAMPING: MENGGELAR BUKU PROMO LAMA
   * Ketika pimpinan menunjuk promo tertentu (selectedPromo), asisten langsung menyalin 
   * seluruh tulisan lama ke atas formulir catatan agar siap dikoreksi.
   */
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

  /**
   * MESIN CUCI DAN TIMBANGAN FOTO (convertToJPEG)
   * Asisten memastikan foto yang diserahkan dicetak ulang ke atas kanvas bersih berwarna putih, 
   * lalu dikeringkan menjadi file JPEG berstandar resmi klinik.
   */
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

  /**
   * PENCATAT SETIAP CORETAN PENA (handleInputChange)
   * Mengatur setiap kali admin mengetik huruf baru, mengganti saklar status, atau menaruh foto baru.
   */
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

  /**
   * TUGAS UTUS KURIR PEMBAWA PERUBAHAN PROMO (submitEditPromo)
   * Asisten melakukan pemeriksaan ketat terhadap formulir sebelum memasukkannya ke dalam koper kiriman.
   */
  const submitEditPromo = async (e) => {
    if (e) e.preventDefault();
    // 1. Periksa apakah kotak wajib dibiarkan kosong
    if (!formData.namaPromo || !formData.jenisPromo || !formData.kode || !formData.tanggalMulai || !formData.tanggalSelesai) {
      setError("Nama, Jenis, Kode, dan Tanggal wajib diisi.");
      return;
    }

    const isKategoriSelected = formData.idKategori && formData.idKategori !== "ALL";
    const isProdukSelected = formData.idProduk && formData.idProduk !== "ALL";

    // 2. Hukum Besi Promo: Tidak boleh memilih Kategori dan Produk secara bersamaan
    if (isKategoriSelected && isProdukSelected) {
      setError("Tidak bisa memilih Kategori dan Produk secara bersamaan. Pilih salah satu, atau kosongkan keduanya.");
      return;
    }

    // 3. Hukum Promo Gratis: Wajib menyertakan produk hadiah yang spesifik
    if (formData.jenisPromo === "Gratis Produk" && !isProdukSelected) {
      setError("Untuk promo Gratis Produk, Anda wajib memilih produk bonus secara spesifik (tidak boleh 'Semua Produk' atau kosong).");
      return;
    }

    setIsSubmitting(true); // Nyalakan lampu kurir berangkat
    try {
      const payload = new FormData(); // Siapkan koper khusus berkas

      // Penyetaran nilai diskon: jika gratis produk, nilai diskon dicatat 0
      let finalDiskon = formData.diskon;
      if (formData.jenisPromo === "Gratis Produk") {
        finalDiskon = 0;
      } else if (!finalDiskon) {
        finalDiskon = 0;
      }

      // Memasukkan berkas satu per satu ke dalam koper
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
      
      // Pastikan saklar status diterjemahkan menjadi angka 1 (Aktif) atau 0 (Mati)
      payload.set('status', formData.status ? 1 : 0);
      // Stempel rahasia penanda pembetulan data (PUT) untuk backend Laravel
      payload.append('_method', 'PUT'); 

      const idPromo = selectedPromo.idPromo || selectedPromo.id;
      const res = await axiosClient.post(`${endpoints.admin.promo}/${idPromo}`, payload);
      
      if (res.data?.success) {
        showToast("Berhasil memperbarui promo", "success");
        if (onSuccess) onSuccess(); // Ketuk palu keberhasilan
      } else {
        showToast("Gagal memperbarui promo.", "error");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal memperbarui data.";
      const errorDetails = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : "";
      setError(errorDetails ? `${errMsg} (${errorDetails})` : errMsg);
      showToast(errorDetails ? `${errMsg} (${errorDetails})` : errMsg, "error");
    } finally {
      setIsSubmitting(false); // Matikan lampu kurir berangkat
    }
  };

  // Asisten menyerahkan pena dan laci isian kepada komponen tampilan (view)
  return {
    formData,
    setFormData,
    error,
    isSubmitting,
    handleInputChange,
    submitEditPromo,
  };
}
