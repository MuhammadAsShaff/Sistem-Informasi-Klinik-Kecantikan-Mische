import { useState, useEffect } from 'react';
import { useEditProduk } from './useEditProduk';
import { useFetchKategori } from '../../KelolaKategoriProduk/hooks/useFetchKategori';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

/**
 * PENGURUS FORMULIR PERBARUI PRODUK (useModalPerbaruiProduk)
 * Ibarat juru tulis yang berjaga di meja khusus pengubahan data. Saat admin ingin mengedit suatu produk, 
 * juru tulis ini langsung menyalin seluruh informasi lama (nama, harga, stok, gambar) ke atas kertas formulir baru.
 * Setelah selesai diedit, formulir diserahkan ke kurir pengirim pembaruan.
 */
export const useModalPerbaruiProduk = (categoryData, isOpen, refetch, showToast, onClose) => {
  // 1. KOTAK-KOTAK ISIAN DI ATAS KERTAS FORMULIR
  const [nama, setNama] = useState(''); // Kotak isian nama barang
  const [harga, setHarga] = useState(''); // Kotak isian harga
  const [stock, setStock] = useState(''); // Kotak isian jumlah stok
  const [berat, setBerat] = useState(''); // Kotak isian berat dalam gram
  const [kategori, setKategori] = useState(''); // Kotak isian jenis kategori
  const [deskripsi, setDeskripsi] = useState(''); // Kotak isian cerita penjelasan produk
  const [gambar, setGambar] = useState(null); // Tempat menempel berkas foto baru
  const [preview, setPreview] = useState(null); // Tampilan kilat foto agar bisa diintip sebelum dikirim
  const [isSubmitting, setIsSubmitting] = useState(false); // Penanda apakah sistem sedang sibuk memproses

  // 2. MEMANGGIL ASISTEN PENDUKUNG
  // - Utusan pengirim berkas perubahan ke gudang pusat
  const { editProduk } = useEditProduk(refetch);
  // - Asisten pencari daftar nama kategori yang tersedia di klinik
  const { categories } = useFetchKategori();

  // 3. PROSES PENYALINAN DATA LAMA KETIKA JENDELA FORMULIR DIBUKA
  // Jika jendela edit dibuka dan ada data barang lama, juru tulis langsung menyalinnya ke formulir
  useEffect(() => {
    if (categoryData && isOpen) {
      setNama(categoryData.nama || categoryData.name || '');
      setHarga(categoryData.harga || '');
      setStock(categoryData.stock || categoryData.count || '');
      setBerat(categoryData.berat || '');
      setKategori(categoryData.idKategori || categoryData.kategori || '');
      setDeskripsi(categoryData.deskripsi || categoryData.description || '');
      setGambar(null); // Kosongkan file foto baru, kecuali admin mau menggantinya
      
      // Mengatur foto lama agar bisa dilihat di layar intip (preview)
      if (categoryData.gambar) {
        setPreview(categoryData.gambar.startsWith('http') ? categoryData.gambar : `${STORAGE_BASE_URL}${String(categoryData.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`);
      } else {
        setPreview(null);
      }
    } else {
      // Jika jendela ditutup, bersihkan seluruh meja formulir
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

  // 4. MENGATUR PENGGANTIAN GAMBAR
  // Saat admin memilih foto baru dari komputer, simpan filenya dan buat salinan tampilannya di layar intip
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // 5. PENYERAHAN FORMULIR KE KURIR
  const handleSave = async () => {
    if (categoryData) {
      // Pastikan semua kolom penting di formulir tidak boleh ada yang bolong/kosong
      if (!nama || !harga || !stock || !berat || !kategori) {
        showToast('Mohon isi semua field yang wajib', 'error');
        return;
      }

      setIsSubmitting(true); // Pasang tanda "Sedang Menyimpan..."
      
      // Membungkus formulir dan lampiran foto ke dalam map tebal (FormData)
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('harga', harga);
      formData.append('stock', stock);
      formData.append('berat', berat);
      formData.append('idKategori', kategori);
      if (deskripsi) formData.append('deskripsi', deskripsi);
      if (gambar) formData.append('gambar', gambar);

      // Utusan membawa map tersebut ke gudang pusat
      const result = await editProduk(categoryData.idProduk || categoryData.id, formData);
      setIsSubmitting(false); // Matikan tanda sibuk

      // Jika gudang pusat menerima perubahan, umumkan lewat TOA dan tutup formulir
      if (result.success) {
        showToast("Berhasil memperbarui produk", 'success');
        onClose();
      } else {
        // Jika ditolak (misal: tulisan harga salah), bacakan alasan penolakannya
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
        }
        showToast(errorDetail, 'error');
      }
    }
  };

  // Seluruh pena, kertas isian, dan tombol kirim ini diserahkan ke tampilan pop-up
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
