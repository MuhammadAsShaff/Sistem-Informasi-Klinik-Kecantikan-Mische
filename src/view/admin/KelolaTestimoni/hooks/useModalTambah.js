import { useState, useEffect } from 'react';
import { useTambahTestimoni } from './useTambahTestimoni';

export const useModalTambah = (isOpen, refetch, showToast, onClose) => {
  const [fileName, setFileName] = useState("No File Choosen");
  const [formData, setFormData] = useState({
    namaTester: '',
    tanggalTreatment: '',
    jenisTestimoni: '',
    deskripsi: '',
    buktiFoto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tambahTestimoni } = useTambahTestimoni(refetch);

  useEffect(() => {
    if (isOpen) {
      setFormData({ namaTester: '', tanggalTreatment: '', jenisTestimoni: '', deskripsi: '', buktiFoto: null });
      setFileName("No File Choosen");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async () => {
    if (formData.namaTester && formData.jenisTestimoni && formData.tanggalTreatment && formData.deskripsi && formData.buktiFoto) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('namaTester', formData.namaTester);
      payload.append('jenisTestimoni', formData.jenisTestimoni);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalTreatment', formData.tanggalTreatment);
      payload.append('buktiFoto', formData.buktiFoto);

      const result = await tambahTestimoni(payload);
      setIsSubmitting(false);
      
      if (result.success) {
        showToast("Berhasil menambahkan testimoni", "success");
        onClose();
      } else {
        // Build a detailed error message if there are validation errors
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

  return {
    fileName,
    formData,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};
