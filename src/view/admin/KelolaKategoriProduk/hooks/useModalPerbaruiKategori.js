import { useState, useEffect } from 'react';
import { useEditKategori } from './useEditKategori';

/**
 * =========================================================================
 * PENGATUR KOTAK PERBARUI KATEGORI (Ibarat Pengatur Formulir Edit Kategori)
 * =========================================================================
 * File ini ibarat "Asisten Penyiap Formulir Edit" di kotak pop-up perbarui.
 * Tugasnya menyalin tulisan nama dan deskripsi lama ke dalam kotak ketik,
 * memastikan nama tidak dikosongkan, lalu mengirim tulisan baru ke server.
 */
export const useModalPerbaruiKategori = (categoryData, isOpen, refetch, showToast, onClose) => {
  // Kotak ketik untuk nama kategori
  const [nama, setNama] = useState('');
  // Kotak ketik untuk deskripsi kategori
  const [deskripsi, setDeskripsi] = useState('');
  // Penanda untuk mengunci tombol simpan saat sistem sedang mengirim data
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Meminta bantuan fungsi pengubah utama
  const { editKategori } = useEditKategori(refetch);

  /*
    MENYALIN DATA LAMA (useEffect):
    Setiap kali pop-up perbarui dibuka dan data kategori masuk (categoryData), 
    asisten ini langsung menyalin tulisan lamanya ke dalam kotak isian.
  */
  useEffect(() => {
    if (categoryData) {
      // Menyalin nama lama (baik yang disimpan dengan nama 'nama' atau 'name')
      setNama(categoryData.nama || categoryData.name || '');
      setDeskripsi(categoryData.deskripsi || categoryData.description || '');
    } else {
      // Jika kosong, bersihkan kotak ketik
      setNama('');
      setDeskripsi('');
    }
  }, [categoryData, isOpen]);

  /*
    FUNGSI MENYIMPAN PERUBAHAN (handleSave):
    Dijalankan saat admin menekan tombol "Simpan Kategori".
  */
  const handleSave = async () => {
    if (categoryData) {
      // PEMERIKSAAN KELENGKAPAN: Jika kotak nama dikosongkan, munculkan pesan peringatan di pojok layar
      if (!nama.trim()) {
        showToast('Nama kategori wajib diisi', 'error');
        return; // Batalkan proses menyimpan
      }
      
      // 1. Kunci tombol simpan sementara agar tidak ditekan berkali-kali
      setIsSubmitting(true);
      // 2. Kirim tulisan nama dan deskripsi baru ke server pusat
      const result = await editKategori(categoryData.idKategori || categoryData.id, { nama, deskripsi });
      // 3. Buka kembali kunci tombol setelah selesai
      setIsSubmitting(false);

      // 4. Jika berhasil disimpan oleh server
      if (result.success) {
        showToast("Berhasil memperbarui kategori produk", 'success'); // Tampilkan pesan berhasil
        onClose(); // Tutup kotak pop-up
      } else {
        // Jika gagal, periksa pesan error dari server dan tampilkan di pojok layar
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
        }
        showToast(errorDetail, 'error'); // Tampilkan pesan gagal
      }
    }
  };

  // Mengirimkan nilai kotak ketik, penanda kunci, dan fungsi simpan ke kotak pop-up ModalPerbaruiKategori
  return {
    nama, setNama,
    deskripsi, setDeskripsi,
    isSubmitting,
    handleSave
  };
};
