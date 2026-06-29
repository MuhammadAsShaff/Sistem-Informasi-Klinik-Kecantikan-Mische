import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints, STORAGE_BASE_URL } from "@/core/api/endpoints";
import { convertToJPEG } from "@/utils/imageConverter";

/**
 * ASISTEN JURU TULIS PERUBAHAN DATA DOKTER (useEditDokter)
 * Ibarat asisten pribadi di meja koreksi yang bertugas mencatat pembaruan biodata dokter lama. 
 * Saat ada dokter yang dipilih, asisten ini menyalin biodata lamanya ke atas kertas formulir. 
 * Asisten ini juga bertugas memastiskan format nama diawali "Dr." dan mengubah foto baru ke 
 * standar JPEG sebelum mengirimkannya ke pihak rumah sakit (server).
 */
export function useEditDokter(selectedDokter, onSuccess, showToast) {
  // 1. KERTAS FORMULIR ISIAN BIODATA DOKTER
  const [formData, setFormData] = useState({
    name: "", // Nama dokter
    email: "", // Alamat email dokter
    description: "", // Penjelasan keahlian atau jadwal
    image: "", // Tampilan intip foto
    status: "Tersedia", // Status kehadiran (Tersedia / Tidak Tersedia)
  });
  
  // Catatan peringatan jika ada kotak yang lupa diisi
  const [error, setError] = useState("");
  // Tanda bahwa kurir sedang dalam perjalanan mengirim map ke pusat
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. MENGISI FORMULIR OTOMATIS DENGAN CATATAN LAMA
  useEffect(() => {
    if (selectedDokter) {
      // Membersihkan jalur alamat foto agar siap dicetak di layar
      const fullImageUrl = selectedDokter.foto && !selectedDokter.foto.startsWith('http') 
        ? `${STORAGE_BASE_URL}${String(selectedDokter.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`
        : (selectedDokter.foto || "");

      // Mengisi kotak isian dengan nama (menghilangkan awalan Dr. sementara agar mudah diketik)
      setFormData({
        name: selectedDokter.nama ? selectedDokter.nama.replace("Dr. ", "") : "",
        email: selectedDokter.email || "",
        description: selectedDokter.deskripsi || "",
        image: fullImageUrl,
        status: selectedDokter.status || "Tersedia",
      });
    }
  }, [selectedDokter]);

  // Fungsi saat admin mencoret atau mengetik tulisan baru
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi pintar saat admin memilih foto baru
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mengutus tukang cetak untuk menyamakan format foto ke JPEG standar
      const convertedFile = await convertToJPEG(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Pajangan foto di layar
          imageFile: convertedFile, // Berkas foto yang siap dikirim
        }));
      };
      reader.readAsDataURL(convertedFile);
    }
  };

  // 3. PROSES PENGIRIMAN MAP PERUBAHAN KE RUMAH SAKIT PUSAT
  const submitEditDokter = async (e) => {
    if (e) e.preventDefault();
    
    // Pemeriksaan awal: Tidak boleh ada kotak yang kosong melompong
    if (!formData.name || !formData.email || !formData.description) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Memasukkan seluruh isian ke dalam map besar (FormData)
      const data = new FormData();
      // Memastikan nama gelar "Dr." dicantumkan dengan rapi
      data.append('nama', formData.name.startsWith("Dr. ") ? formData.name : `Dr. ${formData.name.toUpperCase()}`);
      data.append('email', formData.email);
      data.append('deskripsi', formData.description);
      
      // Jika ada berkas foto baru, lampirkan juga di dalam map
      if (formData.imageFile) {
        data.append('foto', formData.imageFile);
      }
      
      // Memberi stempel tanda pembaruan data lama (PUT)
      data.append('_method', 'PUT');

      const docId = selectedDokter.idDokter || selectedDokter.id;

      // Kurir mengantarkan map ke bagian manajemen dokter di server
      const res = await axiosClient.post(`${endpoints.admin.doctors}/${docId}`, data);
      
      // Jika manajemen pusat menyetujui, teriakkan pengumuman sukses lewat TOA
      if (res.data?.success) {
        showToast("Berhasil memperbarui profil dokter", "success");
        if (onSuccess) onSuccess(); // Beri tahu halaman utama untuk menyegarkan catatan
      }
    } catch (err) {
      console.error(err);
      // Jika manajemen pusat menolak (misal: email salah format), catat kesalahannya
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Gagal memperbarui data.");
      }
      showToast("Gagal memperbarui profil dokter.", "error");
    } finally {
      setIsSubmitting(false); // Kurir telah selesai menunaikan tugas
    }
  };

  // Asisten menyerahkan seluruh berkas dan penanya ke jendela pop-up
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
