import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * ASISTEN JURU TULIS PENDAFTARAN PROMO BARU (useTambahPromo)
 * =========================================================================
 * Ibarat asisten pendaftaran yang menyediakan formulir kosong bersih untuk meracik promo baru.
 * Tugas asisten ini meliputi:
 * 1. Mengawal admin mengisi formulir pendaftaran dari awal sampai akhir.
 * 2. Menimbang dan mencuci foto promo menjadi format JPEG berstandar klinik.
 * 3. Mengingatkan aturan ketat: tidak boleh memilih Kategori dan Produk sekaligus, 
 *    serta memastikan promo "Gratis Produk" disertai nama produk hadiahnya.
 * 4. Membungkus formulir ke dalam koper (FormData) dan mengirimkannya ke kantor pusat.
 */
export function useTambahPromo(onSuccess, showToast) {
  // Formulir kosong tempat admin mencatat rincian promo baru
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
    // Kosongkan secara default agar promo bersifat global (berlaku untuk semua produk)
    idKategori: "", 
    idProduk: ""
  });
  // Papan teguran jika admin melanggar aturan pengisian
  const [error, setError] = useState("");
  // Rambu penanda kurir sedang mengayuh sepeda menuju kantor pusat
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * MESIN CUCI DAN TIMBANGAN FOTO (convertToJPEG)
   * Asisten memastikan foto yang diunggah ditaruh di atas kanvas putih bersih,
   * lalu dikeringkan menjadi file JPEG berukuran ringan dan resmi.
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
   * Mengatur setiap kali admin mengetik huruf baru, mengganti saklar status, atau memasukkan foto baru.
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
   * TUGAS MEMBERSIHKAN MEJA FORMULIR (resetForm)
   * Mengganti formulir yang kotor atau sudah terpakai dengan formulir putih kosong yang baru.
   */
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

  /**
   * TUGAS UTUS KURIR PEMBAWA BERKAS PROMO BARU (submitTambahPromo)
   * Asisten meneliti keabsahan formulir sebelum mengemasnya ke dalam koper kiriman.
   */
  const submitTambahPromo = async (e) => {
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

    setIsSubmitting(true); // Nyalakan lampu tanda kurir bersiap berangkat
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
      // Pastikan status adalah integer atau boolean string (1/0)
      payload.set('status', formData.status ? 1 : 0);

      const res = await axiosClient.post(endpoints.admin.promo, payload);
      
      if (res.data?.success) {
        showToast("Berhasil menambahkan promo", "success");
        resetForm(); // Bersihkan meja setelah pengiriman berhasil
        if (onSuccess) onSuccess(); // Ketuk palu keberhasilan
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
      setIsSubmitting(false); // Matikan lampu tanda kurir berangkat
    }
  };

  // Asisten menyerahkan pena dan laci formulir kepada komponen tampilan (view)
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
