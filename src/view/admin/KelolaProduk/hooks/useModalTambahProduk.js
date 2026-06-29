import { useState, useEffect } from 'react';
import { useTambahProduk } from './useTambahProduk';
import { useFetchKategori } from '../../KelolaKategoriProduk/hooks/useFetchKategori';

/**
 * PENGURUS FORMULIR PENDAFTARAN PRODUK BARU (useModalTambahProduk)
 * Ibarat juru tulis yang berjaga di meja pendaftaran produk baru. Juru tulis ini menyodorkan 
 * formulir kosong, memandu pengisian nama, harga, dan foto, lalu menyerahkannya ke kurir pendaftaran.
 */
export const useModalTambahProduk = (isOpen, refetch, showToast, onClose) => {
  // 1. KOTAK-KOTAK ISIAN DI ATAS KERTAS FORMULIR
  const [nama, setNama] = useState(''); // Kotak isian nama barang
  const [harga, setHarga] = useState(''); // Kotak isian harga
  const [stock, setStock] = useState(''); // Kotak isian jumlah stok awal
  const [berat, setBerat] = useState(''); // Kotak isian berat barang (satuan gram)
  const [kategori, setKategori] = useState(''); // Pilihan kategori
  const [deskripsi, setDeskripsi] = useState(''); // Kotak isian cerita penjelasan produk
  const [gambar, setGambar] = useState(null); // Tempat melampirkan berkas foto
  const [preview, setPreview] = useState(null); // Tampilan kilat foto sebelum dikirim
  const [isSubmitting, setIsSubmitting] = useState(false); // Penanda sistem sedang sibuk

  // 2. MEMANGGIL ASISTEN PENDUKUNG
  // - Utusan pendaftaran barang baru ke gudang pusat
  const { tambahProduk } = useTambahProduk(refetch);
  // - Asisten pencari daftar nama kategori
  const { categories } = useFetchKategori();

  // 3. MEMBERSIHKAN MEJA SETIAP KALI FORMULIR DIBUKA
  // Agar isian bekas pendaftaran sebelumnya tidak tertinggal, kita ambil formulir yang benar-benar bersih
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

  // 4. MENGATUR LAMPIRAN FOTO BARU
  // Saat admin memilih foto dari komputer, salin tampilannya ke layar intip (preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // 5. PENGIRIMAN FORMULIR KE GUDANG PUSAT
  const handleSave = async (e) => {
    if (e) e.preventDefault(); // Mencegah halaman web melompat atau menyegarkan diri secara paksa
    
    // Memeriksa kelengkapan isi formulir
    if (!nama || !harga || !stock || !berat || !kategori) {
      showToast('Mohon isi semua field yang wajib', 'error');
      return;
    }

    setIsSubmitting(true); // Pasang tanda "Menyimpan..."
    
    // Memasukkan seluruh kertas isian dan foto ke dalam map tebal (FormData)
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('harga', harga);
    formData.append('stock', stock);
    formData.append('berat', berat);
    formData.append('idKategori', kategori);
    if (deskripsi) formData.append('deskripsi', deskripsi);
    if (gambar) formData.append('gambar', gambar);

    // Utusan mengantarkan map ke gudang pusat
    const result = await tambahProduk(formData);
    setIsSubmitting(false); // Matikan tanda sibuk

    // Jika gudang pusat memberi cap "Berhasil Ditambahkan", umumkan lewat TOA dan tutup formulir
    if (result.success) {
      showToast("Berhasil menambahkan produk", 'success');
      onClose();
    } else {
      // Jika ditolak (misal: format foto salah atau ukuran terlalu besar), bacakan alasan penolakannya
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error');
    }
  };

  // Serahkan seluruh fungsi pengisian dan tombol ke tampilan pop-up formulir
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
