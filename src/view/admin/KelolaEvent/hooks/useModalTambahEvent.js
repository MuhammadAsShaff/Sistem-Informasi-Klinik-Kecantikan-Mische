import { useState } from 'react';
// Mengimpor asisten kurir khusus pengirim data pendaftaran event baru ke server
import { useTambahEvent } from './useTambahEvent';
// Mengimpor alat penyulap file gambar (untuk mengubah file gambar menjadi format standar JPEG)
import { convertToJPEG } from '@/utils/imageConverter';

/**
 * =========================================================================
 * ASISTEN PENJAGA FORMULIR EVENT BARU (useModalTambahEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Penjaga Formulir Pendaftaran Event Baru".
 * Tugas pokoknya sangat jelas:
 * 1. Menyiapkan kertas formulir kosong (nama, lokasi, tanggal, foto).
 * 2. Mengamati dan mencatat setiap ketikan admin di kotak isian formulir.
 * 3. Menyulap (mengonversi) foto promosi baru menjadi format standar JPEG.
 * 4. Meminta asisten `useTambahEvent` untuk menyetorkan pendaftaran ini ke server.
 * 
 * Asisten ini dibekali 3 titipan pesan:
 * - refetch   : Tombol penyegar tabel utama agar event baru langsung muncul setelah sukses disimpan.
 * - showToast : Pop-up pemberitahuan untuk bilang "Berhasil!" atau "Gagal".
 * - onClose   : Perintah menutup jendela pop-up pendaftaran setelah sukses.
 */
export const useModalTambahEvent = (refetch, showToast, onClose) => {
  // 1. MENGHUBUNGKAN KURIR UTAMA PENDAFTARAN
  // Kita hubungkan dengan useTambahEvent dan menitipkan tombol refetch kepadanya
  const { tambahEvent } = useTambahEvent(refetch);
  
  // 2. KERTAS FORMULIR KOSONG (FORM STATE)
  // Laci penyimpanan tempat menaruh isian formulir yang awalnya kosong melompong
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deskripsi: '',
    foto: null
  });
  
  // Rambu tanda sibuk ('true') agar admin tidak menekan tombol daftar dua kali saat kurir masih lari ke server
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =======================================================================
  // 3. TUGAS SAAT ADMIN MENGISI FORMULIR (CHANGE HANDLER)
  // =======================================================================
  /**
   * Fungsi ini memonitor setiap huruf yang diketik atau file foto yang dipilih admin.
   */
  const handleChange = async (e) => {
    // Membongkar nama kotak, tulisan di dalamnya, jenis kotaknya, dan file yang dipilih
    const { name, value, type, files } = e.target;
    
    // Kalau kotak yang diisi itu adalah tempat menaruh file (foto)
    if (type === 'file') {
      const file = files[0]; // Ambil file pertama yang dipilih
      if (file) {
        // Sulap file gambar tersebut menjadi format JPEG menggunakan alat convertToJPEG
        const converted = await convertToJPEG(file);
        // Masukkan hasil sulapan tersebut ke laci foto di formData
        setFormData(prev => ({ ...prev, [name]: converted }));
      }
    } else {
      // Kalau admin cuma mengetik teks biasa, langsung salin ketikannya ke laci yang pas
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // =======================================================================
  // 4. TUGAS SAAT TOMBOL 'TAMBAH EVENT' DITEKAN (SUBMIT HANDLER)
  // =======================================================================
  /**
   * Mengemas isian formulir ke dalam kotak bungkusan khusus dan mengirimkannya lewat kurir tambahEvent.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah halaman web me-refresh secara mendadak saat tombol ditekan
    setIsSubmitting(true); // Nyalakan animasi berputar pada tombol daftar (kunci tombolnya)
    
    /*
      Membuat Bungkusan Khusus (FormData):
      Karena kita melampirkan file foto, kita wajib membungkusnya ke dalam kotak 
      bernama `FormData` agar kurir web bisa membawanya dengan aman ke server.
    */
    const payload = new FormData();
    payload.append('nama', formData.nama);
    payload.append('lokasi', formData.lokasi);
    payload.append('tanggalMulai', formData.tanggalMulai);
    payload.append('tanggalSelesai', formData.tanggalSelesai);
    payload.append('deskripsi', formData.deskripsi);
    
    // Jika ada foto yang sudah dimasukkan, ikutkan ke dalam bungkusan
    if (formData.foto) {
      payload.append('foto', formData.foto);
    }
    
    // Perintahkan kurir 'tambahEvent' membawa bungkusan ini ke alamat server
    const result = await tambahEvent(payload);
    
    setIsSubmitting(false); // Matikan putaran animasi loading
    
    // Kita periksa laporan hasil kerja kurir:
    if (result.success) {
      showToast("Hore! Berhasil menambahkan event baru"); // Munculkan pop-up pemberitahuan hijau
      // Bersihkan formulir kembali menjadi kosong melompong seperti kertas baru
      setFormData({ nama: '', lokasi: '', tanggalMulai: '', tanggalSelesai: '', deskripsi: '', foto: null });
      onClose(); // Tutup jendela pop-up pendaftaran
    } else {
      showToast(result.message, "error"); // Munculkan pop-up pemberitahuan merah (pesan error dari server)
    }
  };

  // Asisten menyerahkan catatan formulir dan pengendali tombol ini ke tampilan ModalTambahEvent
  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};

