import { useState, useEffect } from 'react';
import { useEditTestimoni } from './useEditTestimoni';

export const useModalEdit = (data, isOpen, refetch, showToast, onClose) => {
  const [fileName, setFileName] = useState("No File Choosen");
  const [formData, setFormData] = useState({
    namaTester: '',
    tanggalTreatment: '',
    jenisTestimoni: '',
    deskripsi: '',
    buktiFoto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { editTestimoni } = useEditTestimoni(refetch);

  // Initialize form data when opened with existing data
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        namaTester: data.namaTester || '',
        tanggalTreatment: data.tanggalTreatment ? data.tanggalTreatment.split(' ')[0] : '',
        jenisTestimoni: data.jenisTestimoni || '',
        deskripsi: data.deskripsi || '',
        buktiFoto: null // For update, we don't preview existing via formData state (Tabel.jsx handles showing it), we only hold new file
      });
      setFileName(data.buktiFoto ? "File existing (Pilih untuk ganti)" : "No File Choosen");
      setIsSubmitting(false);
    }
  }, [isOpen, data]);

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
    if (formData.namaTester && formData.jenisTestimoni && formData.tanggalTreatment && formData.deskripsi) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('namaTester', formData.namaTester);
      payload.append('jenisTestimoni', formData.jenisTestimoni);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalTreatment', formData.tanggalTreatment);
      
      // Bukti foto is optional on edit
      if (formData.buktiFoto) {
        payload.append('buktiFoto', formData.buktiFoto);
      }

      const result = await editTestimoni(data.id || data.idTestimoni, payload);
      setIsSubmitting(false);

      if (result.success) {
        showToast("Berhasil memperbarui testimoni", "success");
        onClose();
      } else {
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
          console.error("Validation Errors:", result.errors);
        }
        showToast(errorDetail, "error");
      }
    } else {
      showToast("Mohon isi field yang wajib!", "error");
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
