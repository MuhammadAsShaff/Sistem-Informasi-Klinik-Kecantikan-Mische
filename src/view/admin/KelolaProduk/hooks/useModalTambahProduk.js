import { useState, useEffect } from 'react';
import { useTambahProduk } from './useTambahProduk';
import { useFetchKategori } from '../../KelolaKategoriProduk/hooks/useFetchKategori';

export const useModalTambahProduk = (isOpen, refetch, showToast, onClose) => {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stock, setStock] = useState('');
  const [berat, setBerat] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tambahProduk } = useTambahProduk(refetch);
  const { categories } = useFetchKategori();

  useEffect(() => {
    if (isOpen) {
      setNama('');
      setHarga('');
      setStock('');
      setBerat('');
      setKategori('');
      setDeskripsi('');
      setGambar(null);
      setPreview(null);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!nama || !harga || !stock || !berat || !kategori) {
      showToast('Mohon isi semua field yang wajib', 'error');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('harga', harga);
    formData.append('stock', stock);
    formData.append('berat', berat);
    formData.append('idKategori', kategori);
    if (deskripsi) formData.append('deskripsi', deskripsi);
    if (gambar) formData.append('gambar', gambar);

    const result = await tambahProduk(formData);
    setIsSubmitting(false);

    if (result.success) {
      showToast("Berhasil menambahkan produk", 'success');
      onClose();
    } else {
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error');
    }
  };

  return {
    nama, setNama,
    harga, setHarga,
    stock, setStock,
    berat, setBerat,
    kategori, setKategori,
    deskripsi, setDeskripsi,
    gambar,
    preview,
    isSubmitting,
    categories,
    handleImageChange,
    handleSave
  };
};
