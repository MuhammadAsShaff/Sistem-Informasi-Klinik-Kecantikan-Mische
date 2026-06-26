import { useState, useEffect } from 'react';
import { useEditProduk } from './useEditProduk';
import { useFetchKategori } from '../../KelolaKategoriProduk/hooks/useFetchKategori';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

export const useModalPerbaruiProduk = (categoryData, isOpen, refetch, showToast, onClose) => {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stock, setStock] = useState('');
  const [berat, setBerat] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { editProduk } = useEditProduk(refetch);
  const { categories } = useFetchKategori();

  useEffect(() => {
    if (categoryData && isOpen) {
      setNama(categoryData.nama || categoryData.name || '');
      setHarga(categoryData.harga || '');
      setStock(categoryData.stock || categoryData.count || '');
      setBerat(categoryData.berat || '');
      setKategori(categoryData.idKategori || categoryData.kategori || '');
      setDeskripsi(categoryData.deskripsi || categoryData.description || '');
      setGambar(null);
      if (categoryData.gambar) {
        setPreview(categoryData.gambar.startsWith('http') ? categoryData.gambar : `${STORAGE_BASE_URL}${String(categoryData.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`);
      } else {
        setPreview(null);
      }
    } else {
      setNama('');
      setHarga('');
      setStock('');
      setBerat('');
      setKategori('');
      setDeskripsi('');
      setGambar(null);
      setPreview(null);
    }
  }, [categoryData, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    if (categoryData) {
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

      const result = await editProduk(categoryData.idProduk || categoryData.id, formData);
      setIsSubmitting(false);

      if (result.success) {
        showToast("Berhasil memperbarui produk", 'success');
        onClose();
      } else {
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
        }
        showToast(errorDetail, 'error');
      }
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
