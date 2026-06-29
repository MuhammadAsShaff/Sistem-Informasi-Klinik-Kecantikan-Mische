import { useState, useEffect } from 'react';
import { useTambahTestimoni } from './useTambahTestimoni';

/**
 * =========================================================================
 * ASISTEN PENGAWAL MEJA PENDAFTARAN TESTIMONI (useModalTambah)
 * =========================================================================
 * Ibarat asisten ramah yang menjaga meja pendaftaran ulasan baru di sudut balai.
 * Tugas utama asisten ini meliputi:
 * 1. Menyediakan kertas formulir baru yang putih bersih setiap kali meja dibuka.
 * 2. Memeriksa keberadaan foto wajah pelanggan (wajib ada!).
 * 3. Membimbing admin menuliskan nama, tanggal, jenis pujian, dan deksripsi sebelum mengutus Kurir (useTambahTestimoni).
 */
export const useModalTambah = (isOpen, refetch, showToast, onClose) => {
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
  // Rambu penanda kurir sedang mengayuh sepeda ke loket pusat
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mempekerjakan Asisten Kurir Pendaftaran Testimoni Baru
  const { tambahTestimoni } = useTambahTestimoni(refetch);

  /**
   * EFEK SAMPING: MEMBERSIHKAN FORMULIR SAAT MEJA DIBUKA
   * Begitu meja pendaftaran dibuka (isOpen), asisten langsung menyapu bersih sisa coretan lama.
   */
  useEffect(() => {
    if (isOpen) {
      setFormData({ namaTester: '', tanggalTreatment: '', jenisTestimoni: '', deskripsi: '', buktiFoto: null });
      setFileName("No File Choosen");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  /**
   * PENCATAT SETIAP CORETAN PENA (handleChange)
   * Setiap kali admin menuliskan nama atau deskripsi, asisten mencatatnya dengan rapi.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * PENELITI UNGGAHAN FOTO (handleFileChange)
   * Asisten meneliti file foto yang disodorkan dan menyimpannya di klip lampiran formulir.
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
   * TUGAS PENGUTUSAN KURIR PENDAFTARAN (handleSubmit)
   * Asisten memastikan tidak ada kotak isian yang bolong (termasuk foto wajib!), lalu menyuruh Kurir berangkat.
   */
  const handleSubmit = async () => {
    if (formData.namaTester && formData.jenisTestimoni && formData.tanggalTreatment && formData.deskripsi && formData.buktiFoto) {
      setIsSubmitting(true); // Nyalakan lampu tanda kurir berangkat
      const payload = new FormData();
      payload.append('namaTester', formData.namaTester);
      payload.append('jenisTestimoni', formData.jenisTestimoni);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalTreatment', formData.tanggalTreatment);
      payload.append('buktiFoto', formData.buktiFoto);

      const result = await tambahTestimoni(payload);
      setIsSubmitting(false); // Matikan lampu tanda kurir berangkat
      
      if (result.success) {
        showToast("Berhasil menambahkan testimoni", "success");
        onClose(); // Tutup meja pendaftaran
      } else {
        // Jika formulir ditolak loket pusat, asisten membacakan alasan penolakannya
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
          console.error("Validation Errors:", result.errors);
        }
        showToast(errorDetail, "error");
      }
    } else {
      showToast("Mohon isi semua form termasuk unggah foto!", "error");
    }
  };

  // Asisten menyerahkan pena dan seluruh laci formulir kepada meja pendaftaran (view)
  return {
    fileName,
    formData,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};
