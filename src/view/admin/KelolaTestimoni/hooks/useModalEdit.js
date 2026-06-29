import { useState, useEffect } from 'react';
import { useEditTestimoni } from './useEditTestimoni';

/**
 * =========================================================================
 * ASISTEN PENGAWAL MEJA KOREKSI (useModalEdit)
 * =========================================================================
 * Ibarat asisten sigap yang berdiri di samping meja perbaikan ulasan.
 * Tugas utama asisten ini meliputi:
 * 1. Menyodorkan berkas ulasan lama (data) ke atas kertas formulir agar mudah diperiksa pimpinan.
 * 2. Mengingat nama file foto baru jika pimpinan ingin mengganti foto profil pelanggan.
 * 3. Mengawal ketat kelengkapan formulir sebelum menyerahkannya kepada Juru Tulis Perbaikan (useEditTestimoni).
 */
export const useModalEdit = (data, isOpen, refetch, showToast, onClose) => {
  // Papan label pencatat nama file foto yang diunggah
  const [fileName, setFileName] = useState("No File Choosen");
  // Kertas formulir isian ulasan tempat mencatat nama, tanggal, jenis, deskripsi, dan foto
  const [formData, setFormData] = useState({
    namaTester: '',
    tanggalTreatment: '',
    jenisTestimoni: '',
    deskripsi: '',
    buktiFoto: null
  });
  // Rambu penanda asisten sedang sibuk mengantarkan berkas ke loket pusat
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mempekerjakan Juru Tulis Perbaikan Lembar Testimoni
  const { editTestimoni } = useEditTestimoni(refetch);

  /**
   * EFEK SAMPING: MENYODORKAN DATA LAMA KETIKA MEJA DIBUKA
   * Begitu meja koreksi dibuka (isOpen) dan berkas ulasan diserahkan (data), 
   * asisten langsung menyalin tulisan lamanya ke atas kertas formulir.
   */
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        namaTester: data.namaTester || '',
        tanggalTreatment: data.tanggalTreatment ? data.tanggalTreatment.split(' ')[0] : '',
        jenisTestimoni: data.jenisTestimoni || '',
        deskripsi: data.deskripsi || '',
        buktiFoto: null // Untuk perbaikan, foto lama sudah terpajang di tabel, asisten hanya menampung jika ada foto baru
      });
      setFileName(data.buktiFoto ? "File existing (Pilih untuk ganti)" : "No File Choosen");
      setIsSubmitting(false);
    }
  }, [isOpen, data]);

  /**
   * PENCATAT SETIAP CORETAN PENA (handleChange)
   * Setiap kali admin mengganti kata atau tanggal, asisten mencatatnya dengan teliti.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * PENELITI UNGGAHAN FOTO BARU (handleFileChange)
   * Begitu foto baru disodorkan, asisten memeriksa namanya dan meletakkannya di klip formulir.
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFormData(prev => ({ ...prev, buktiFoto: file }));
    } else {
      setFileName("No File Choosen");
      setFormData(prev => ({ ...prev, buktiFoto: null }));
    }
  };

  /**
   * TUGAS PENGUTUSAN JURU TULIS PERBAIKAN (handleSubmit)
   * Asisten memastikan semua kotak wajib terisi, lalu meminta Juru Tulis berlari ke loket pusat.
   */
  const handleSubmit = async () => {
    if (formData.namaTester && formData.jenisTestimoni && formData.tanggalTreatment && formData.deskripsi) {
      setIsSubmitting(true); // Nyalakan lampu tanda juru tulis berangkat
      const payload = new FormData();
      payload.append('namaTester', formData.namaTester);
      payload.append('jenisTestimoni', formData.jenisTestimoni);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalTreatment', formData.tanggalTreatment);
      
      // Bukti foto hanya dilampirkan jika admin memilih foto baru
      if (formData.buktiFoto) {
        payload.append('buktiFoto', formData.buktiFoto);
      }

      const result = await editTestimoni(data.id || data.idTestimoni, payload);
      setIsSubmitting(false); // Matikan lampu tanda sibuk

      if (result.success) {
        showToast("Berhasil memperbarui testimoni", "success");
        onClose(); // Tutup meja perbaikan
      } else {
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
          console.error("Validation Errors:", result.errors);
        }
        showToast(errorDetail, "error"); // Umumkan jika kandas
      }
    } else {
      showToast("Mohon isi field yang wajib!", "error");
    }
  };

  // Asisten menyerahkan pena dan seluruh berkas kepada meja perbaikan (view)
  return {
    fileName,
    formData,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};
