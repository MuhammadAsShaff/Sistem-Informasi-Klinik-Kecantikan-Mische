import { useState, useEffect } from 'react';
import { useTambahKategori } from './useTambahKategori';

/**
 * =========================================================================
 * PENGATUR KOTAK TAMBAH KATEGORI (Ibarat Pengatur Formulir Pendaftaran Baru)
 * =========================================================================
 * File ini ibarat "Asisten Penyiap Formulir Baru" di kotak pop-up tambah.
 * Tugasnya membersihkan kotak isian saat pop-up dibuka, memastikan kotak nama
 * tidak dikosongkan, lalu mengirim tulisan baru ke server pusat.
 */
export const useModalTambahKategori = (isOpen, refetch, showToast, onClose) => {
  // Kotak ketik untuk nama kategori baru
  const [nama, setNama] = useState('');
  // Kotak ketik untuk deskripsi kategori baru
  const [deskripsi, setDeskripsi] = useState('');
  // Penanda untuk mengunci tombol simpan agar tidak ditekan berkali-kali
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Meminta bantuan fungsi penambah kategori utama
  const { tambahKategori } = useTambahKategori(refetch);

  /*
    MEMBERSIHKAN KOTAK ISIAN (useEffect):
    Setiap kali pop-up pendaftaran dibuka (isOpen = true), 
    asisten ini langsung membersihkan kotak ketik dari sisa tulisan sebelumnya.
  */
  useEffect(() => {
    if (isOpen) {
      setNama('');
      setDeskripsi('');
    }
  }, [isOpen]);

  /*
    FUNGSI MENYIMPAN KATEGORI BARU (handleSave):
    Dijalankan begitu admin menekan tombol "Tambah Kategori".
  */
  const handleSave = async () => {
    // PEMERIKSAAN KELENGKAPAN: Jika kotak nama kosong, tampilkan pesan peringatan di pojok layar
    if (!nama.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return; // Batalkan proses menyimpan
    }

    // 1. Kunci tombol simpan sementara
    setIsSubmitting(true);
    // 2. Kirim tulisan nama dan deskripsi baru ke server pusat
    const result = await tambahKategori({ nama, deskripsi });
    // 3. Buka kembali kunci tombol setelah selesai
    setIsSubmitting(false);

    // 4. Jika berhasil ditambahkan ke server
    if (result.success) {
      showToast("Berhasil menambahkan kategori produk", 'success'); // Tampilkan pesan berhasil
      onClose(); // Tutup kotak pop-up
    } else {
      // Jika gagal (misal nama kategori sudah ada sebelumnya), periksa pesan error dari server
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error'); // Tampilkan pesan gagal di pojok layar
    }
  };

  // Mengirimkan nilai kotak ketik, penanda kunci, dan fungsi simpan ke kotak pop-up ModalTambahKategori
  return {
    nama, setNama,
    deskripsi, setDeskripsi,
    isSubmitting,
    handleSave
  };
};
