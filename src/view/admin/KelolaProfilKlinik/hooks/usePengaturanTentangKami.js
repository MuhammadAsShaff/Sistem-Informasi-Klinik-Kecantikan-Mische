import { useState, useEffect, useRef } from 'react';

export const usePengaturanTentangKami = (data, onSimpan, onError) => {
  const [formData, setFormData] = useState({
    deskripsiPerusahaan: '',
    visi: '',
    misi: '',
    jamBuka: '',
    jamTutup: '',
    nomorCustomerService: '',
    fotoPerusahaan: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [hasFileError, setHasFileError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFormData({
        deskripsiPerusahaan: data.deskripsiPerusahaan || '',
        visi: data.visi || '',
        misi: data.misi || '',
        jamBuka: data.jamBuka ? data.jamBuka.substring(0, 5) : '',
        jamTutup: data.jamTutup ? data.jamTutup.substring(0, 5) : '',
        nomorCustomerService: data.nomorCustomerService || '',
        fotoPerusahaan: null
      });
      setPreviewImage(data.fotoPerusahaan ? `http://127.0.0.1:8000/storage/${data.fotoPerusahaan}` : null);
    } else {
      setFormData({
        deskripsiPerusahaan: '', visi: '', misi: '', jamBuka: '', jamTutup: '', nomorCustomerService: '', fotoPerusahaan: null
      });
      setPreviewImage(null);
    }
    
    // Pastikan input file dibersihkan setelah fetch/reload data
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorCustomerService') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate 2MB BEFORE converting
      if (file.size > 2 * 1024 * 1024) {
        onError("Ukuran file terlalu besar! Maksimal 2MB.");
        setHasFileError(true);
        e.target.value = '';
        return;
      }
      
      const { convertToJPEG } = await import('@/utils/imageConverter');
      const convertedFile = await convertToJPEG(file);
      
      setHasFileError(false);
      setFormData({ ...formData, fotoPerusahaan: convertedFile });
      setPreviewImage(URL.createObjectURL(convertedFile));
    }
  };

  const handleSubmit = () => {
    // Validasi inputan form agar tidak ada yang kosong
    if (!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService) {
      onError("Isi profile klinik sesuai dengan ketentuan inputan!");
      return;
    }
    
    // Jika foto belum ada di database (atau buat baru), wajib upload
    if (!data?.fotoPerusahaan && !formData.fotoPerusahaan) {
      onError("Isi profile klinik sesuai dengan ketentuan inputan!");
      return;
    }

    onSimpan(formData);
  };

  return {
    formData,
    setFormData,
    previewImage,
    hasFileError,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};
